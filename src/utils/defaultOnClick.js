/**
 * Default handler for Click event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultOnClick = function (e) {
    const activeShape = e.originalEvent.activeObject;

    this._options.map.geoObjects.remove(this.polygonActive);

    this.polygonActive = new ymaps.Polygon([activeShape._properties.objectGeometry], {
        hintContent: 'Polygon'
    }, {
        fillColor: '#00FF0088',
        strokeWidth: 3
    });

    this._options.map.geoObjects.add(this.polygonActive);
};

export default defaultOnClick;
