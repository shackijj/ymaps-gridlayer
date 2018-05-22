import './../Gridmap/Gridmap';
import data from './data/bikeparking.json';

ymaps.ready(() => {
    ymaps.modules.require(['Gridmap'], (Gridmap) => {
        const map = new ymaps.Map('map1', {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
        });
        const gridmap = new Gridmap({
            map: map,
            data,
            strokeWidth: 3,
            strokeColor: 'rgba(0,0,0,0.3)',
            grid: {
                type: 'hexagon',
                bigRadius: 15
            },
            getShapeColor(pointsCount, totalCount) {
                return `rgba(0,255,0,${pointsCount / totalCount * 100})`;
            }
        });

        let polygonActive = null;
        let polygonHover = null;
        gridmap.events.add('click', (e) => {
            const activeShape = e.originalEvent.activeObject;
            map.geoObjects.remove(polygonActive);
            polygonActive = new ymaps.Polygon([activeShape._properties.objectGeometry], {
                hintContent: 'Polygon'
            }, {
                fillColor: '#00FF0088',
                strokeWidth: 3
            });
            map.geoObjects.add(polygonActive);
        });

        gridmap.events.add('click', (e) => {
            const activeShape = e.originalEvent.activeObject;
            map.geoObjects.remove(polygonActive);
            polygonActive = new ymaps.Polygon([activeShape._properties.objectGeometry], {
                hintContent: 'Polygon'
            }, {
                fillColor: '#00FF0088',
                strokeWidth: 3
            });
            map.geoObjects.add(polygonActive);
        });
        gridmap.events.add('balloonclose', () => {
            map.geoObjects.remove(polygonActive);
        });

        gridmap.events.add('mouseenter', (e) => {
            const activeShape = e.originalEvent.activeObject;
            polygonHover = new ymaps.Polygon([activeShape._properties.objectGeometry], {
                hintContent: 'Polygon'
            }, {
                fillColor: '#00FF0088',
                strokeWidth: 3
            });
            map.geoObjects.add(polygonHover);
        });
        gridmap.events.add('mouseleave', () => {
            map.geoObjects.remove(polygonHover);
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
