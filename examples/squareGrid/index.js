import '../../src/GridmapLayer';
import data from '../data/bikeparking-moscow.geojson';

ymaps.ready(() => {
    ymaps.modules.require(['GridmapLayer'], (GridmapLayer) => {
        // eslint-disable-next-line no-unused-vars
        const map = new ymaps.Map('map', {
            center: [37.64, 55.76],
            zoom: 10,
            controls: ['zoomControl']
        },
        {
            minZoom: 8
        });

        const gridmap = new GridmapLayer(data, {
            map,
            gridType: 'square',
            gridHexagonRadius: 15,
            filterEmptyShapes: true,
            hotspotZindex: 201,
            hotspotCursor: 'help',
            shapeColor: (points) =>
                `rgba(0,255,0,${points.length / data.features.length * 100})`
        });
    });
});
