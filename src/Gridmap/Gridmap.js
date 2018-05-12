import {getHexagonsForTile} from './utils/hexagon';

ymaps.modules.define('Gridmap', [
    'Layer',
    'util.hd'
], (provide, Layer, utilHd) => {
    const TILE_SIZE = 256;
    const dpr = utilHd.getPixelRatio();

    const R = 50;
    function sin(angle) {
        return Math.sin(Math.PI * angle / 180);
    }

    function cos(angle) {
        return Math.cos(Math.PI * angle / 180);
    }
    class Canvas {
        constructor(size) {
            this._canvas = document.createElement('canvas');
            this._canvas.width = size[0] * dpr;
            this._canvas.height = size[1] * dpr;
            this._context = this._canvas.getContext('2d');
        }

        _clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }

        _drawTile(tileNumber) {
            this._clear();
            const hexogons = getHexagonsForTile(tileNumber, TILE_SIZE, R);
            hexogons.forEach(([x, y]) => {
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

    const canvas = new Canvas([256, 256]);

    function tileUrlTemplate(tileNumber, tileZoom) {
        return canvas.getDataURL(tileNumber, tileZoom);
    }

    class Gridmap {
        constructor(map) {
            const layer = new ymaps.Layer(tileUrlTemplate, {
                /**
                 * This is necessary because otherwise tiles are rendered
                 * on top of the previously rendered tiles that create a weird effect.
                 */
                tileTransparent: true
            });
            map.layers.add(layer);
        }

        setMap(map) {
            this._map = map;
        }
    }

    provide(Gridmap);
});
