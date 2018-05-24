/**
 * Default handler for Click event.
 *
 * @param {Object} e Event object.
 * @this Gridmap
 */
const defaultOnClick = function (e) {
    const activeShape = e.originalEvent.activeObject;
    const map = this._options.get('map');

    map.geoObjects.remove(this.polygonActive);

    this.polygonActive = new ymaps.Polygon([activeShape._properties.objectGeometry], {
        hintContent: 'Polygon'
    }, {
        fillColor: '#00FF0088',
        strokeWidth: 3
    });

    map.geoObjects.add(this.polygonActive);
};

export default defaultOnClick;
