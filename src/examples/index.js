import './../Gridmap/Gridmap';
import data from './data/bikeparking.json';

ymaps.ready(() => {
    ymaps.modules.require(['Gridmap'], (Gridmap) => {
        const map = new ymaps.Map(
            'map1',
            {
                center: [55.76, 37.64],
                zoom: 10,
                controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
            },
            {
                minZoom: 8
            });
        const gridmap = new Gridmap(data, {
            map: map,
            gridType: 'hexagon',
            gridHexagonRadius: 15,
            filterEmptyShapes: true,
            hotSpotZindex: 201,
            hotSpotCursor: 'pointer'
        });

        let polygonHover = null;

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
    const map2 = new ymaps.Map(
        'map2',
        {
            center: [55.76, 37.64],
            zoom: 10,
            controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
        },
        {
            minZoom: 8
        });

    ymaps.modules.require(['Gridmap'], (Gridmap) => {
        // eslint-disable-next-line
        const gridmap = new Gridmap(
            data,
            {
                map: map2,
                gridType: 'square',
                gridHexagonRadius: 15,
                hotspotZindex: 201,
                hotspotCursor: 'help',
                shapeColor: (points) => `rgba(0,255,0,${points.length / data.features.length * 100})`
            });

        let polygonActive = null;
        gridmap.events.add('click', (e) => {
            const activeShape = e.originalEvent.activeObject;
            map2.geoObjects.remove(polygonActive);

            polygonActive = new ymaps.Polygon([activeShape._properties.objectGeometry], {
                hintContent: 'Polygon'
            }, {
                fillColor: '#00FF0088',
                strokeWidth: 2
            });
            map2.geoObjects.add(polygonActive);
        });
        gridmap.events.add('balloonclose', () => {
            map2.geoObjects.remove(polygonActive);
        });
    });
});
