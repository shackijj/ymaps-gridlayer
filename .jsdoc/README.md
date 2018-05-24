# Yandex Maps API GridmapLayer Module

Yandex.Maps API module for data visualization.

**GridmapLayer** is a graphical representation of some spatial data, where depending on the number of entered points grid cells are painted in different colors.
`GridmapLayer` class allows to construct and display such representations over geographical maps.

## Loading

1. Put module source code ([gridmap-layer.min.js](https://github.com/yandex-shri-fx-team/ymaps-gridmap/blob/master/umd/gridmap-layer.min.js)) on your CDN.

2. Load both [Yandex Maps JS API 2.1](http://api.yandex.com/maps/doc/jsapi/) and module source code by adding following code into &lt;head&gt; section of your page:

   ```html
   <script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
   <!-- Change my.cdn.tld to your CDN host name -->
   <script src="http://my.cdn.tld/gridmap.min.js" type="text/javascript"></script>
   ```

   If you use [GeoJSON](http://geojson.org) data:

   ```html
   <script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU&coordOrder=longlat" type="text/javascript"></script>
   <!-- Change my.cdn.tld to your CDN host name -->
   <script src="http://my.cdn.tld/gridmap.min.js" type="text/javascript"></script>
   ```

   If you use [npm](https://www.npmjs.com):

   ```html
   <script src="http://api-maps.yandex.ru/2.1/?lang=ru_RU" type="text/javascript"></script>
   ```

   ```bash
   npm i --save git+https://github.com/yandex-shri-fx-team/ymaps-gridmap-layer.git
   ```

   ```js
   require('ymaps-gridmap-layer');

   // Or with babel
   import 'ymaps-gridmap-layer';
   ```

3. Get access to module functions by using [ymaps.modules.require](http://api.yandex.ru/maps/doc/jsapi/2.1/ref/reference/modules.require.xml) method:

   ```js
   ymaps.modules.require(['GridmapLayer'], function (GridmapLayer) {
        var gridmap = new GridmapLayer();
   });
   ```

{{>main}}

## Examples

### Creating a simple map

```javascript
const map = new ymaps.Map('idOfMap', {
    center: [55.76, 37.64],
    zoom: 10,
    controls: ['zoomControl', 'typeSelector', 'fullscreenControl']
}, {
    minZoom: 8
});

const gridmap = new GridmapLayer(data, {
    map,
    gridType: 'hexagon',
    gridHexagonRadius: 15,
    filterEmptyShapes: true
});
```

### Adding events

All events of [hotspot.Layer](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/hotspot.Layer-docpage/#%D0%A1%D0%BE%D0%B1%D1%8B%D1%82%D0%B8%D1%8F) are avaiable.

```javascript
const gridmap = new GridmapLayer(data, {
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

gridmap.events.add('mouseleave', (e) => {
    map.geoObjects.remove(polygonHover);
});
```

### Changing interactivity

In order to change the hotspot.Layer's default options, user could pass hotspotLayerOptions, which
are described [here](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/hotspot.Layer-docpage/#param-options).

```javascript
const gridmap = new GridmapLayer(data, {
    map,
    gridType: 'hexagon',
    gridHexagonRadius: 15,
    hotspotLayerOptions: {
        zIndex: 201,
        interactivityModel: 'default#opaque'
    }
});
```

## Demo

- https://yandex-shri-fx-team.github.io/ymaps-gridmap-layer
