/**
 * Default handler for mouseEnter event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultOnMouseEnter = function (e) {
    const activeShape = e.originalEvent.activeObject;

    this.polygonHover = new ymaps.Polygon([activeShape._properties.objectGeometry], {
        hintContent: 'Polygon'
    }, {
        fillColor: '#00FF0088',
        strokeWidth: 3
    });

    this._options.get('map').geoObjects.add(this.polygonHover);
};

export default defaultOnMouseEnter;
