/**
 * Default handler for mouseLeave event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultOnMouseLeave = function () {
    this._options.map.geoObjects.remove(this.polygonHover);
};

export default defaultOnMouseLeave;
