/**
 * Default handler for balloonClose event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultOnBalloonClose = function () {
    const map = this._options.get('map');

    map.geoObjects.remove(this.polygonActive);
};

export default defaultOnBalloonClose;
