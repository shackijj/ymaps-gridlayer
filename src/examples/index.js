import './../Boilerplate/Boilerplate';

ymaps.ready(() => {
    // eslint-disable-next-line no-unused-vars
    const myMap = new ymaps.Map('map', {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    });

    ymaps.modules.require(['Boilerplate', 'Layer'], (Boilerplate) => {
        const data = [[55.76, 37.64], [55.76, 37.65]];
        const boilerplate = new Boilerplate(myMap, data);
    });
});
