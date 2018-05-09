import identity from './utils/identity';

ymaps.modules.define('Boilerplate', [
    'option.Manager',
    'Monitor',
    'Layer'
], (provide, OptionManager) => {

    class Canvas {
        constructor (size) {
            this._canvas = document.createElement('canvas');
            this._canvas.width = size[0];
            this._canvas.height = size[1];
            this._context = this._canvas.getContext('2d');
        }

        _clear() {
            this._context.clearRect(0, 0, this._canvas.width, this._canvas.height);
        }

        _draw() {
            this._clear();
            this._context.fillRect(0, 0, 30, 30);
        }

        getDataURL() {
            this._draw();
            return this._canvas.toDataURL();
        }
    }

    const canvas = new Canvas([256, 256]);

    function tileUrlTemplate(tileNumber, tileZoom) {
        return canvas.getDataURL()
    }

    class Boilerplate {
        constructor(map, options) {
            var layer = new ymaps.Layer(tileUrlTemplate);
            map.layers.add(layer);
        }

        setMap(map) {
            this._map = map;
        }
    }

    provide(Boilerplate);
});
