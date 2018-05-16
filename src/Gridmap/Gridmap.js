import {getCentersOfHexagonsForTile} from './utils/hexagon';
import RTree from 'rtree';

ymaps.modules.define('Gridmap', [
    'Layer',
    'util.hd',
    'util.defineClass',
    'util.extend'
], (provide, Layer, utilHd, defineClass, extend) => {
    const TILE_SIZE = 256;
    const dpr = utilHd.getPixelRatio();
    const ZOOM = 10;
    const R = 30;
    const r = sin(60) * R;

    function sin(angle) {
        return Math.sin(Math.PI * angle / 180);
    }

    function cos(angle) {
        return Math.cos(Math.PI * angle / 180);
    }
    class Canvas {
        constructor(size, {features}, map) {
            this._projection = map.options.get('projection');
            this._data = features;
            this._canvas = document.createElement('canvas');
            this._canvas.width = size[0] * dpr;
            this._canvas.height = size[1] * dpr;
            this._context = this._canvas.getContext('2d');
            this._buildTree();
        }

        _buildTree() {
            this._tree = new RTree();
            this._data.forEach((feature) => {
                const [x, y] = this._projection.toGlobalPixels(
                    feature.geometry.coordinates, ZOOM);
                this._tree.insert(
                    {
                        x,
                        y,
                        w: 0,
                        h: 0
                    },
                    feature);
            });
        }
        _clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }

        _getShapesForTile(tileNumber, zoom, R) {
            const hexogons = getCentersOfHexagonsForTile(tileNumber, TILE_SIZE, R);
            const offset = [
                tileNumber[0] * TILE_SIZE,
                tileNumber[1] * TILE_SIZE
            ];
            return hexogons.map(([x, y]) => {
                const globalBbox = {
                    x: (x + offset[0]) - R,
                    y: (y + offset[1]) - r,
                    w: 2 * R,
                    h: 2 * r
                };
                const points = this._tree.search(globalBbox);

                const left = x - R;
                const top = y - r;

                return {
                    type: 'Feature',
                    properties: {
                        hintContent: JSON.stringify([x, y]),
                        balloonContentBody: `Тут ${points.length} точек!`,
                        balloonContentHeader: 'Заголовок балуна.',
                        balloonContentFooter: 'Нижняя часть балуна.',
                        // Можно задавать свойство balloonContent вместо Body/Header/Footer

                        // Обязательное поле
                        HotspotMetaData: {
                            // Идентификатор активной области.
                            id: Date.now(),

                            // Данные, на основе которых создается геометрия активной области.
                            // Обязательное поле.
                            RenderedGeometry: {
                                type: 'Polygon',
                                // Координаты многоугольника.
                                coordinates: [
                                    [
                                        [left, top],
                                        [left + 2 * R, top],
                                        [left + 2 * R, top + 2 * r],
                                        [left, top + 2 * r],
                                        [left, top]
                                    ]
                                ]
                            }
                        }
                    }
                };
            });
        }

        _drawTile(tileNumber) {
            this._clear();
            this._context.strokeRect(0, 0, TILE_SIZE * dpr, TILE_SIZE * dpr);
            const hexogons = getCentersOfHexagonsForTile(tileNumber, TILE_SIZE, R);
            const offset = [
                tileNumber[0] * TILE_SIZE,
                tileNumber[1] * TILE_SIZE
            ];
            hexogons.forEach(([x, y]) => {
                const globalBbox = {
                    x: (x + offset[0]) - R,
                    y: (y + offset[1]) - r,
                    w: 2 * R,
                    h: 2 * r
                };
                const points = this._tree.search(globalBbox);
                const hexagon = [
                    [cos(0), sin(0)],
                    [cos(60), sin(60)],
                    [cos(120), sin(120)],
                    [cos(180), sin(180)],
                    [cos(240), sin(240)],
                    [cos(300), sin(300)],
                    [cos(0), sin(0)]
                ];
                this._context.translate(x * dpr, y * dpr);
                this._context.beginPath();
                hexagon.forEach(([x, y], idx) => {
                    if (idx === 0) {
                        this._context.moveTo(x * R * dpr, y * R * dpr);
                    } else {
                        this._context.lineTo(x * R * dpr, y * R * dpr);
                    }
                });
                const ratio = points.length / this._data.length;
                this._context.fillStyle = `rgba(0,255,0,${ratio * 50})`;
                this._context.fill();
                this._context.stroke();
                this._context.closePath();
                this._context.setTransform(1, 0, 0, 1, 0, 0);
                this._context.strokeRect((x - R) * dpr, (y - r) * dpr, R * 2 * dpr, r * 2 * dpr);
                this._context.fillStyle = 'black';
                this._context.fillText('(' + x + ' ' + y + ')', x * dpr, y * dpr);
            });
        }

        getDataURL(tileNumer, zoom) {
            this._drawTile(tileNumer, zoom);
            return this._canvas.toDataURL();
        }
    }

    class Gridmap {
        constructor(map, featureCollection) {
            const canvas = new Canvas([256, 256], featureCollection, map);

            function tileUrlTemplate(tileNumber, tileZoom) {
                return canvas.getDataURL(tileNumber, tileZoom);
            }

            const HotspotLayerLocal = function (data, options) {
                HotspotLayerLocal.superclass.constructor.call(this, '', extend({}, options));
            };

            defineClass(HotspotLayerLocal, ymaps.hotspot.ObjectSource, {
                requestObjects: function (layer, tileNumber, zoom, callback) {
                    const features = {
                        data: {
                            type: 'FeatureCollection',
                            features: canvas._getShapesForTile(tileNumber, ZOOM, R)
                        }
                    };
                    this.parseResponse(layer, features, callback, tileNumber, ZOOM);
                }
            });

            const layer = new ymaps.Layer(tileUrlTemplate, {
                /**
                 * This is necessary because otherwise tiles are rendered
                 * on top of the previously rendered tiles that create a weird effect.
                 */
                tileTransparent: true
            });
            const objSource = new HotspotLayerLocal(tileUrlTemplate);
            const hotspotLayer = new ymaps.hotspot.Layer(objSource, {zIndex: 2000, cursor: 'help'});
            map.layers.add(hotspotLayer);
            map.layers.add(layer);
        }

        setMap(map) {
            this._map = map;
        }
    }

    provide(Gridmap);
});
