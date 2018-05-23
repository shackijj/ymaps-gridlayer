import './../Gridmap/Gridmap';
import data from './data/bikeparking.json';

ymaps.ready(() => {
    // eslint-disable-next-line no-unused-vars
    const map1 = new ymaps.Map('map1', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });

    ymaps.modules.require(['Gridmap'], (Gridmap) => {
        // eslint-disable-next-line
        const gridmap = new Gridmap(data, {
            //map: map1,
            gridType: 'hexagon',
            gridHexagonRadius: 15,
            filterEmptyShapes: true,
            shapeColor(pointsCount, totalCount) {
                return `rgba(0,255,0,${pointsCount / totalCount * 100})`;
            }
        });
    });

    // eslint-disable-next-line no-unused-vars
    const map2 = new ymaps.Map('map2', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });

    ymaps.modules.require(['Gridmap'], (Gridmap) => {
        // eslint-disable-next-line
        const gridmap = new Gridmap(data, {
            map: map2,
            gridType: 'square',
            gridHexagonRadius: 15,
            shapeColor(pointsCount, totalCount) {
                return `rgba(0,255,0,${pointsCount / totalCount * 100})`;
            }
        });
    });
});
