/**
 * Default handler for mouseLeave event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultOnMouseLeave = function () {
    const map = this._options.get('map');

    map.geoObjects.remove(this.polygonHover);
};

export default defaultOnMouseLeave;
