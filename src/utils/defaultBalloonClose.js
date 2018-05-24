/**
 * Default handler for balloonClose event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultBalloonClose = function () {
    const map = this._options.get('map');

    map.geoObjects.remove(this.polygonActive);
};

export default defaultBalloonClose;
