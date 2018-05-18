import {getCentersOfHexagonsForTile} from './utils/hexagon';
import RTree from 'rtree';
import classifyPoint from 'robust-point-in-polygon';

ymaps.modules.define('Gridmap', [
    'Layer',
    'util.hd',
    'util.defineClass',
    'util.extend'
], (provide, Layer, utilHd, defineClass, extend) => {
    const TILE_SIZE = 256;
    const dpr = utilHd.getPixelRatio();
    const ZOOM = 10;
    const R = 15;
    const r = sin(60) * R;

    function sin(angle) {
        return Math.sin(Math.PI * angle / 180);
    }

    function cos(angle) {
        return Math.cos(Math.PI * angle / 180);
    }
    class Canvas {
        constructor(size, {features}, map) {
            this._map = map;
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

                const point = {
                    feature,
                    pixelCoords: [x, y]
                };
                this._tree.insert(
                    {
                        x,
                        y,
                        w: 0,
                        h: 0
                    },
                    point);
            });
        }
        _clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }

        _getPointsForShape(shapeCenter, globalOffset, R, r) {
            const [x, y] = shapeCenter;

            const scale = Math.pow(2, ZOOM - this._map.getZoom());
            const globalBbox = {
                x: ((x + globalOffset[0]) - R) * scale,
                y: ((y + globalOffset[1]) - r) * scale,
                w: 2 * R * scale,
                h: 2 * r * scale
            };

            const shape = this._getShapeGlobal(shapeCenter, globalOffset, R, scale);
            const points = this._tree
                .search(globalBbox)
                .filter(({pixelCoords}) => {
                    return classifyPoint(shape, pixelCoords) >= 0;
                });

            return points;
        }

        _getShapeGlobal(shapeCenter, globalOffset, R, scale) {
            const [x, y] = shapeCenter;
            const hexagon = [
                [cos(0), sin(0)],
                [cos(60), sin(60)],
                [cos(120), sin(120)],
                [cos(180), sin(180)],
                [cos(240), sin(240)],
                [cos(300), sin(300)],
                [cos(0), sin(0)]
            ];

            return hexagon.map(([hX, hY]) => [
                (x + globalOffset[0] + (hX * R)) * scale,
                (y + globalOffset[1] + (hY * R)) * scale
            ]);
        }

        _getTileOffset(tileNumber, tileSize) {
            return [
                tileNumber[0] * tileSize,
                tileNumber[1] * tileSize
            ];
        }

        _getHotspotsForTile(tileNumber, zoom, R) {
            const result = [];
            const scale = Math.pow(2, ZOOM - this._map.getZoom());
            const bigRadius = R / scale;
            const smallRadius = r / scale;
            const hexogons = getCentersOfHexagonsForTile(tileNumber, TILE_SIZE, bigRadius);
            const offset = this._getTileOffset(tileNumber, TILE_SIZE);
            hexogons.forEach(([x, y]) => {
                const points = this._getPointsForShape([x, y], offset, bigRadius, smallRadius);
                if (points.length > 0) {
                    const hexagon = this._getShapeGlobal([x, y], [0, 0], bigRadius, 1);
                    result.push({
                        type: 'Feature',
                        properties: {
                            balloonContentBody: `Тут ${points.length} точек!`,
                            balloonContentHeader: JSON.stringify(hexagon),
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
                                        hexagon
                                    ]
                                }
                            }
                        }
                    });
                }
            });

            return result;
        }

        _drawTile(tileNumber) {
            this._clear();
            this._context.strokeRect(0, 0, TILE_SIZE * dpr, TILE_SIZE * dpr);

            const scale = Math.pow(2, ZOOM - this._map.getZoom());
            const bigRadius = R / scale;
            const smallRadius = r / scale;

            const hexogons = getCentersOfHexagonsForTile(tileNumber, TILE_SIZE, bigRadius);
            const offset = this._getTileOffset(tileNumber, TILE_SIZE);

            hexogons.forEach(([x, y]) => {
                const points = this._getPointsForShape([x, y], offset, bigRadius, smallRadius);
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
                        this._context.moveTo(x * bigRadius * dpr, y * bigRadius * dpr);
                    } else {
                        this._context.lineTo(x * bigRadius * dpr, y * bigRadius * dpr);
                    }
                });
                const ratio = points.length / this._data.length;
                this._context.fillStyle = `rgba(0,255,0,${ratio * 100})`;
                this._context.fill();
                this._context.stroke();
                this._context.closePath();
                this._context.setTransform(1, 0, 0, 1, 0, 0);
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
                            features: canvas._getHotspotsForTile(tileNumber, ZOOM, R)
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
