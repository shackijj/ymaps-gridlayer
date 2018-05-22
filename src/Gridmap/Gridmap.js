import Hexagon from './utils/Hexagon';
import Square from './utils/Square';
import RTree from 'rtree';
import classifyPoint from 'robust-point-in-polygon';
import './HotspotObjectSourceBrowser';

/**
 * @typedef {HexagonGridOptions}
 * @property {number} bigRadius
 * @property {string} type
 */

/**
 * @typedef {SquareGridOptions}
 * @property {number} sideLength
 * @property {string} type
 */

/**
 * @typedef {GridmapOptions}
 * @property {IMap} map
 * @property {IGeoJSON} data
 * @property {SquareGridOptions|HexagonGridOptions} grid
 */

ymaps.modules.define('Gridmap', [
    'Layer',
    'util.hd',
    'util.defineClass',
    'util.extend',
    'HotspotObjectSourceBrowser'
], (provide, Layer, utilHd, defineClass, extend, HotspotObjectSourceBrowser) => {
    const dpr = utilHd.getPixelRatio();

    class Gridmap {
        constructor(options) {
            const TILE_SIZE = 256;
            this._options = options;
            this._projection = this._options.map.options.get('projection');
            this._data = options.data.features;
            this._canvas = document.createElement('canvas');
            this._canvas.width = TILE_SIZE * dpr;
            this._canvas.height = TILE_SIZE * dpr;
            this._tileSize = TILE_SIZE;
            this._context = this._canvas.getContext('2d');
            this._buildTree();

            switch (options.grid.type) {
                case 'hexagon': {
                    this._shape = new Hexagon(this._options.grid.bigRadius);
                    break;
                }
                case 'square': {
                    this._shape = new Square(this._options.grid.sideLength);
                    break;
                }
                default: {
                    throw new Error('Unknowk grid type');
                }
            }

            const tileUrlTemplate = (tileNumber, tileZoom) => this.getDataURL(tileNumber, tileZoom);

            this.layer = new ymaps.Layer(tileUrlTemplate, {
                /**
                 * This is necessary because otherwise tiles are rendered
                 * on top of the previously rendered tiles that create a weird effect.
                 */
                tileTransparent: true
            });
            this.objSource = new HotspotObjectSourceBrowser(tileUrlTemplate, {
                getHotspotsForTile: (tileNumber, zoom) => this._getHotspotsForTile(tileNumber, zoom)
            });

            this.hotspotLayer = new ymaps.hotspot.Layer(this.objSource, {zIndex: 201, cursor: 'help'});

            this._options.map.layers.add(this.hotspotLayer);
            this._options.map.layers.add(this.layer);

            this.events = this.hotspotLayer.events;
        }

        _buildTree() {
            this._tree = new RTree();
            this._treeZoom = this._options.map.getZoom();
            this._data.forEach((feature) => {
                const [x, y] = this._projection.toGlobalPixels(
                    feature.geometry.coordinates, this._treeZoom);

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

        _getScale() {
            return Math.pow(2, this._treeZoom - this._options.map.getZoom());
        }
        _getPointsForShape(shapeCenter, shapeVertices, offset) {
            const scale = this._getScale();
            const globalShape = shapeVertices.map(([x, y]) => [
                (x + offset[0]) * scale,
                (y + offset[1]) * scale
            ]);
            const globalBbox = this._shape.getBBox(shapeCenter, offset, scale);
            return this._tree.search(globalBbox)
                .filter(({pixelCoords}) => classifyPoint(globalShape, pixelCoords) <= 0);
        }

        _getTileOffset(tileNumber, tileSize) {
            return [
                tileNumber[0] * tileSize,
                tileNumber[1] * tileSize
            ];
        }

        _getHotspotsForTile(tileNumber) {
            const result = [];
            const scale = this._getScale();
            const shapes = this._shape.getCentersForTile(tileNumber, this._tileSize, scale);
            const offset = this._getTileOffset(tileNumber, this._tileSize);
            shapes.forEach(([x, y]) => {
                const shape = this._shape.getPixelVerticesForTile([x, y], scale);
                const points = this._getPointsForShape([x, y], shape, offset);
                if (points.length > 0) {
                    const objectGeometry = shape.map(([hX, hY]) => this._projection.fromGlobalPixels(
                        [
                            hX + offset[0],
                            hY + offset[1]
                        ],
                        this._options.map.getZoom()));
                    result.push({
                        type: 'Feature',
                        properties: {
                            balloonContentBody: `Тут ${points.length} точек!`,
                            balloonContentHeader: JSON.stringify(shape),
                            balloonContentFooter: 'Нижняя часть балуна.',
                            objectGeometry: objectGeometry,
                            // Можно задавать свойство balloonContent вместо Body/Header/Footer
                            // Обязательное поле
                            HotspotMetaData: {
                                // Идентификатор активной области.
                                id: JSON.stringify(points),
                                // Данные, на основе которых создается геометрия активной области.
                                // Обязательное поле.
                                RenderedGeometry: {
                                    type: 'Polygon',
                                    coordinates: [
                                        shape
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
            const scale = this._getScale();
            const shapesCenters = this._shape.getCentersForTile(tileNumber, this._tileSize, scale);
            const offset = this._getTileOffset(tileNumber, this._tileSize);

            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);

            shapesCenters.forEach(([x, y]) => {
                const shape = this._shape.getPixelVerticesForTile([x, y], scale);
                const points = this._getPointsForShape([x, y], shape, offset);

                this._context.beginPath();

                shape.forEach(([x, y], idx) => {
                    if (idx === 0) {
                        this._context.moveTo(x * dpr, y * dpr);
                    } else {
                        this._context.lineTo(x * dpr, y * dpr);
                    }
                });
                this._context.fillStyle = this._options.getShapeColor(points.length, this._data.length);
                this._context.fill();
                this._context.strokeStyle = this._options.strokeColor || 'black';
                this._context.lineWidth = this._options.strokeWidth || 1;
                this._context.stroke();
                if (this._options.debug) {
                    this._context.fillStyle = 'black';
                    this._context.fillText(points.length, x, y);
                }
                this._context.closePath();
            });
        }

        getDataURL(tileNumer, zoom) {
            this._drawTile(tileNumer, zoom);
            return this._canvas.toDataURL();
        }
    }

    provide(Gridmap);
});
