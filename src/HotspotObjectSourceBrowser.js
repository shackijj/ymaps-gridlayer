/**
 * HotspotObjectSourceBrowser.
 *
 * @module HotspotObjectSourceBrowser
 * @requires util.defineClass
 * @requires util.extend
 * @requires hotspot.ObjectSource
 */
ymaps.modules.define('HotspotObjectSourceBrowser', [
    'util.defineClass',
    'util.extend',
    'hotspot.ObjectSource'
], (provide, defineClass, extend, hotspotObjectSource) => {
    const HotspotObjectSourceBrowser = function (data, options) {
        HotspotObjectSourceBrowser.superclass.constructor.call(this, '', extend({}, options));
        this.options.set('getHotspotsForTile', options.getHotspotsForTile);
    };

    defineClass(HotspotObjectSourceBrowser, hotspotObjectSource, {
        requestObjects: function (layer, tileNumber, zoom, callback) {
            const getHotspotsForTile = this.options.get('getHotspotsForTile');
            const features = {
                data: {
                    type: 'FeatureCollection',
                    features: getHotspotsForTile(tileNumber, zoom)
                }
            };
            this.parseResponse(layer, features, callback, tileNumber, zoom);
        }
    });
    provide(HotspotObjectSourceBrowser);
});
