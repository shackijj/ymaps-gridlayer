/**
 * Default handler for balloonClose event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultBalloonClose = function () {
    this._options.get('map').geoObjects.remove(this.polygonActive);
};

export default defaultBalloonClose;
