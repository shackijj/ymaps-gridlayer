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
            gridType: 'hexagon',
            hotSpotZindex: 201,
            hotSpotCursor: 'pointer',
            shapeColor: (points) => {
                const ranges = [0, 5, 10, 20, 80, 150];
                const colors = [
                    'rgba(0,224,130, 0.8)',
                    'rgba(0,213,79, 0.8)',
                    'rgba(0,193,7, 0.8)',
                    'rgba(0,160,0, 0.8)',
                    'rgba(0,111,0, 0.8)',
                    'rgba(0,61,21, 0.8)'
                ];

                const pointsCount = points.length;

                if (pointsCount < ranges[0]) return colors[0];

                let color = colors[ranges.length - 1];

                for (let i = 0; i < ranges.length; i++) {
                    if (pointsCount >= ranges[i] && pointsCount < ranges[i + 1]) {
                        color = colors[i];
                        break;
                    }
                }

                return color;
            },
        });
    });
});
