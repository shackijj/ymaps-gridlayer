import './../Gridmap/Gridmap';
import data from './data/bikeparking.json';

ymaps.ready(() => {
    // eslint-disable-next-line no-unused-vars
    const myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });

    ymaps.modules.require(['Gridmap'], (Gridmap) => {
        // eslint-disable-next-line
        const gridmap = new Gridmap(myMap, data);
    });
});
