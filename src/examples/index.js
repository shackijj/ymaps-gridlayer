import './../Gridmap/Gridmap';

ymaps.ready(() => {
    // eslint-disable-next-line no-unused-vars
    const myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 1,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });

    ymaps.modules.require(['Gridmap'], (Gridmap) => {
        const data = [[55.76, 37.64], [55.76, 37.65]];
        const gridmap = new Gridmap(myMap, data);
    });
});
