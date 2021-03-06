import Hexagon from './utils/Hexagon';
import Square from './utils/Square';
import RTree from 'rtree';
import classifyPoint from 'robust-point-in-polygon';
import './HotspotObjectSourceBrowser';
import defaultOnMouseEnter from './utils/defaultOnMouseEnter';
import defaultOnMouseLeave from './utils/defaultOnMouseLeave';
import defaultOnClick from './utils/defaultOnClick';
import defaultOnBalloonClose from './utils/defaultOnBalloonClose';
import defaultBalloonContent from './utils/defaultBalloonContent';

/**
 * GridmapLayer module.
 *
 * @module GridmapLayer
 * @requires Layer
 * @requires util.hd
 * @requires util.defineClass
 * @requires util.extend
 * @requires HotspotObjectSourceBrowser
 * @requires option.Manager
 */
ymaps.modules.define('GridmapLayer', [
    'Layer',
    'util.hd',
    'util.defineClass',
    'util.extend',
    'HotspotObjectSourceBrowser',
    'option.Manager'
], (provide, Layer, utilHd, defineClass, extend, HotspotObjectSourceBrowser, OptionManager) => {
    const dpr = utilHd.getPixelRatio();

    /**
     * @param {Object} data Object of points.
     * @param {Object} [options] Options for customization.
     * @param {Imap} options.map Required. Map.
     * @param {boolean} [options.debug=false] Flag to show debug.
     * @param {string} options.gridType Required. Type of grid can be "hexagon" | "square".
     * @param {string} [options.gridHexagonRadius=15] Radius of hexagon.
     * @param {string} [options.gridSquareSidelength=15] Side length of square.
     * @param {boolean} [options.filterEmptyShapes=false] Flag to render empty shapes.
     * @param {string} [options.emptyShapesColor=rgba(255,255,255, 0)] Fill color of shapes where points count equal 0.
     * @param {function} options.shapeColor Function to get fill color of shape.
     * Receives count point in shape and total point count.
     * @param {string} [options.strokeColor=#666] Color of shapes stroke.
     * @param {number} [options.strokeWidth=1] Width of shapes stroke.
     * @param {functions} options.getHotspotProps Properties of hotspot layer.
     * @param {Object} [options.hotspotLayerOptions] Options of hotspot layer.
     * @param {number} [options.hotspotLayerOptions.zIndex=201] ZIndex of hotspot.
     * @param {Object} [options.hotspotLayerOptions.cursor=pointer] Cursor of hotspot.
     * @param {function} options.onMouseEnter Hadler of mouseEnter event.
     * @param {function} options.onMouseLeave Hadler of mouseLeave event.
     * @param {function} options.onClick Hadler of click event.
     * @param {function} options.onBalloonClose Hadler of baloon close event.
     * @param {function} options.balloonContent Render baloon html. Receive array of points.
     * @param {boolean} [options.interactivity=true] Flag to enable interactivity.
     * @alias module:GridmapLayer
     */
    class GridmapLayer {
        constructor(data, options) {
            const defaultOptions = new OptionManager({
                map: undefined,
                debug: false,
                gridType: undefined,
                gridHexagonRadius: 20,
                gridSquareSidelength: 20,
                filterEmptyShapes: false,
                emptyShapesColor: 'rgba(255,255,255, 0)',
                shapeColor: (points) => {
                    const ranges = [0, 5, 10, 20, 80, 150];
                    const colors = [
                        'rgba(255,224,130, 0.8)',
                        'rgba(255,213,79, 0.8)',
                        'rgba(255,193,7, 0.8)',
                        'rgba(255,160,0, 0.8)',
                        'rgba(255,111,0, 0.8)',
                        'rgba(216,61,21, 0.8)'
                    ];

                    const pointsCount = points.length;

                    if (pointsCount < ranges[0]) return colors[0];

                    let color = colors[ranges.length - 1];

                    for (let i = 0; i < ranges.length; i++) {
                        if (pointsCount >= ranges[i] && pointsCount < ranges[i + 1]) {
                            color = colors[i];
                            break;
                        }
                    }

                    return color;
                },
                strokeColor: '#666',
                strokeWidth: 1,
                getHotspotProps: (points) => ({
                    balloonContentBody: `The number of points is ${points.length}`,
                    balloonContentHeader: 'Object\'s data',
                    balloonContentFooter: 'Powered by Gridmap',
                    hintContent: `${points.length}`
                }),
                hotspotLayerOptions: {
                    zIndex: 201,
                    cursor: 'pointer'
                },
                onMouseEnter: defaultOnMouseEnter,
                onMouseLeave: defaultOnMouseLeave,
                onClick: defaultOnClick,
                onBalloonClose: defaultOnBalloonClose,
                balloonContent: defaultBalloonContent,
                interactivity: true
            });

            this._options = new OptionManager(options, defaultOptions);

            if (!this._options.get('map')) throw new Error('option "map" is required');

            const TILE_SIZE = 256;
            this._projection = this._options.get('map').options.get('projection');
            this._data = data.features;
            this._canvas = document.createElement('canvas');
            this._canvas.width = TILE_SIZE * dpr;
            this._canvas.height = TILE_SIZE * dpr;
            this._tileSize = TILE_SIZE;
            this._context = this._canvas.getContext('2d');
            this._buildTree();

            switch (this._options.get('gridType')) {
                case 'hexagon': {
                    this._shape = new Hexagon(this._options.get('gridHexagonRadius'));
                    break;
                }
                case 'square': {
                    this._shape = new Square(this._options.get('gridSquareSidelength'));
                    break;
                }
                default: {
                    throw new Error('Unknown grid type');
                }
            }

            const tileUrlTemplate = (tileNumber, tileZoom) => this._getDataURL(tileNumber, tileZoom);

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

            this.hotspotLayer = new ymaps.hotspot.Layer(
                this.objSource,
                this._options.get('hotspotLayerOptions')
            );

            this._options.get('map').layers.add(this.hotspotLayer);
            this._options.get('map').layers.add(this.layer);

            this.events = this.hotspotLayer.events;

            const onMouseEnter = this._options.get('onMouseEnter');
            const onMouseLeave = this._options.get('onMouseLeave');
            const onClick = this._options.get('onClick');
            const onBalloonClose = this._options.get('onBalloonClose');

            this._options.set('onMouseEnter', onMouseEnter.bind(this));
            this._options.set('onMouseLeave', onMouseLeave.bind(this));
            this._options.set('onClick', onClick.bind(this));
            this._options.set('onBalloonClose', onBalloonClose.bind(this));

            if (this._options.get('interactivity')) {
                this._initInteractivity(this.hotspotLayer);
            }
        }

        _initInteractivity(hotspotLayer) {
            this.polygonHover = null;
            this.polygonActive = null;

            const onMouseEnter = this._options.get('onMouseEnter');
            const onMouseLeave = this._options.get('onMouseLeave');
            const onClick = this._options.get('onClick');
            const onBalloonClose = this._options.get('onBalloonClose');

            hotspotLayer.events.add('mouseenter', onMouseEnter);
            hotspotLayer.events.add('mouseleave', onMouseLeave);
            hotspotLayer.events.add('click', onClick);
            hotspotLayer.events.add('balloonclose', onBalloonClose);
        }

        _buildTree() {
            this._tree = new RTree();
            this._treeZoom = this._options.get('map').getZoom();
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
            return Math.pow(2, this._treeZoom - this._options.get('map').getZoom());
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
            const getHotspotProps = this._options.get('getHotspotProps');

            shapes.forEach(([x, y]) => {
                const shape = this._shape.getPixelVerticesForTile([x, y], scale);
                const points = this._getPointsForShape([x, y], shape, offset);
                if (points.length > 0) {
                    const objectGeometry = shape.map(([hX, hY]) => this._projection.fromGlobalPixels(
                        [
                            hX + offset[0],
                            hY + offset[1]
                        ],
                        this._options.get('map').getZoom())
                    );
                    const userProperties = typeof getHotspotProps === 'function' ? getHotspotProps(points) :
                        defaultBalloonContent(points);

                    const geometryProperties = {
                        points: points,
                        objectGeometry: objectGeometry,
                        HotspotMetaData: {
                            id: JSON.stringify(points),
                            RenderedGeometry: {
                                type: 'Polygon',
                                coordinates: [
                                    shape
                                ]
                            }
                        }
                    };
                    const properties = Object.assign({}, userProperties, geometryProperties);
                    result.push({
                        type: 'Feature',
                        properties
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
                const pointsCount = points.length;

                if (this._options.get('filterEmptyShapes') && pointsCount === 0) return;

                this._context.beginPath();

                shape.forEach(([x, y], idx) => {
                    if (idx === 0) {
                        this._context.moveTo(x * dpr, y * dpr);
                    } else {
                        this._context.lineTo(x * dpr, y * dpr);
                    }
                });

                if (pointsCount > 0) {
                    this._context.fillStyle = this._options.get('shapeColor')(points);
                } else {
                    this._context.fillStyle = this._options.get('emptyShapesColor');
                }
                this._context.fill();

                this._context.strokeStyle = this._options.get('strokeColor');
                this._context.strokeWidth = this._options.get('strokeWidth');
                this._context.stroke();

                if (this._options.get('debug')) {
                    this._context.fillStyle = 'black';
                    this._context.fillText(points.length, x, y);
                }
                this._context.closePath();
            });
        }

        _getDataURL(tileNumer, zoom) {
            this._drawTile(tileNumer, zoom);
            return this._canvas.toDataURL();
        }
    }

    provide(GridmapLayer);
});
