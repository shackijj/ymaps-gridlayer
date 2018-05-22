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
        const gridmap = new Gridmap({
            map: map1,
            data,
            grid: {
                type: 'hexagon',
                bigRadius: 15
            },
            getShapeColor(pointsCount, totalCount) {
                return `rgba(0,255,0,${pointsCount / totalCount * 100})`;
            },
            debug: true,
            colorScheme: 'summer',
            colorRanges: 10,
            colorOpacity: 0.7,
            colorEmptyPolygon: 'rgba(255,255,255, 0)',
            strokeColor: '#fff',
            strokeWidth: 1
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
        const gridmap = new Gridmap({
            map: map2,
            data,
            grid: {
                type: 'square',
                sideLength: 15
            },
            getShapeColor(pointsCount, totalCount) {
                return `rgba(0,255,0,${pointsCount / totalCount * 100})`;
            }
        });
    });
});
