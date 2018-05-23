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
            hotspotOptions: {
                zIndex: 201,
                cursor: 'pointer'
            },
            getShapeColor: (points) => `rgba(0,255,0,${points.length / data.features.length * 100})`,
            getHotspotProps: (points) => ({
                balloonContentBody: `
                    <ul>
                        ${points.map(({feature: {properties}}) => `<li>${properties.Attributes.Name}</li>`).join('')}
                    </ul>
                `,
                balloonContentHeader: `${points.length} парковок`,
                balloonContentFooter: 'Нижняя часть балуна.',
                hintContent: `Тут ${points.length} парковок`
            })
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
            hotspotOptions: {
                zIndex: 201,
                cursor: 'help'
            },
            getShapeColor: (points) => `rgba(0,255,0,${points.length / data.features.length * 100})`
        });

        let polygonActive = null;
        gridmap.events.add('click', (e) => {
            const activeShape = e.originalEvent.activeObject;
            map2.geoObjects.remove(polygonActive);

            polygonActive = new ymaps.Polygon([activeShape._properties.objectGeometry], {
                hintContent: 'Polygon'
            }, {
                fillColor: '#00FF0088',
                strokeWidth: 3
            });
            map2.geoObjects.add(polygonActive);
        });
    });
});
