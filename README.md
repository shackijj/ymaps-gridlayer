# Yandex Maps API GridmapLayer
Yandex.Maps API's module for data visualization.

Gridmap is a graphical representation of some spatial data, where depending on the number of entered points grid cells are painted in different colors.


## Usage

```bash
npm i
npm run build
```

For development:

```bash
npm run dev
```

For linting:

```bash
npm run lint
```

For testing:

```bash
npmr test
```

## Examples

### Creating a simple map
```javascript
const map = new ymaps.Map(
    'idOfMap',
    {
        center: [55.76, 37.64],
        zoom: 10,
        controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
    },
    {
        minZoom: 8
    });
const gridmap = new Gridmap(
    data, 
    {
        map,
        gridType: 'hexagon',
        gridHexagonRadius: 15,
        filterEmptyShapes: true
    });
```

### Adding events
All events of [hotspot.Layer](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/hotspot.Layer-docpage/#%D0%A1%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D1%8F) are avaiable.

```javascript
const gridmap = new Gridmap(
    data, 
    {
        map,
        gridType: 'hexagon',
        gridHexagonRadius: 15,
        filterEmptyShapes: true
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
```
### Changing interactivity
In order to change the hotspot.Layer's default options, user could pass hotspotLayerOptions, which 
are described [here](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/hotspot.Layer-docpage/#param-options)
```javascript
const gridmap = new Gridmap(
    data, 
    {
        map,
        gridType: 'hexagon',
        gridHexagonRadius: 15,
        hotspotLayerOptions: {
           zIndex: 201,
           interactivityModel: 'default#opaque'
        }
    });
```
