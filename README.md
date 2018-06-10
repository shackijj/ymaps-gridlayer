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

## Modules

<dl>
<dt><a href="#module_GridmapLayer">GridmapLayer</a></dt>
<dd><p>GridmapLayer module.</p>
</dd>
<dt><a href="#module_HotspotObjectSourceBrowser">HotspotObjectSourceBrowser</a></dt>
<dd><p>HotspotObjectSourceBrowser.</p>
</dd>
</dl>

<a name="module_GridmapLayer"></a>

## GridmapLayer
GridmapLayer module.

**Requires**: <code>module:Layer</code>, <code>module:util.hd</code>, <code>module:util.defineClass</code>, <code>module:util.extend</code>, [<code>HotspotObjectSourceBrowser</code>](#module_HotspotObjectSourceBrowser), <code>module:option.Manager</code>  

* [GridmapLayer](#module_GridmapLayer)
    * [GridmapLayer](#exp_module_GridmapLayer--GridmapLayer) ⏏
        * [new GridmapLayer(data, [options])](#new_module_GridmapLayer--GridmapLayer_new)
        * [~tileTransparent](#module_GridmapLayer--GridmapLayer..tileTransparent)
        * [~IFeatureGeometry](#module_GridmapLayer--GridmapLayer..IFeatureGeometry) : <code>Object</code>
        * [~IFeature](#module_GridmapLayer--GridmapLayer..IFeature) : <code>Object</code>
        * [~IFeatureCollection](#module_GridmapLayer--GridmapLayer..IFeatureCollection) : <code>Object</code>
        * [~getHotspotProps](#module_GridmapLayer--GridmapLayer..getHotspotProps) ⇒ <code>HotspotObjectProps</code>
        * [~getColor](#module_GridmapLayer--GridmapLayer..getColor) ⇒ <code>string</code>
        * [~eventCallback](#module_GridmapLayer--GridmapLayer..eventCallback) : <code>function</code>

<a name="exp_module_GridmapLayer--GridmapLayer"></a>

### GridmapLayer ⏏
**Kind**: Exported class  
<a name="new_module_GridmapLayer--GridmapLayer_new"></a>

#### new GridmapLayer(data, [options])

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| data | <code>IFeatureCollection</code> |  | Object which contains points for visulization. |
| [options] | <code>Object</code> |  | Options for customization. |
| options.map | <code>IMap</code> |  | Required. Map. [https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/Map-docpage/) |
| [options.debug] | <code>boolean</code> | <code>false</code> | Flag to show debug. |
| options.gridType | <code>string</code> |  | Required. Type of grid can be "hexagon" | "square". |
| [options.gridHexagonRadius] | <code>string</code> | <code>15</code> | Radius of a hexagon in pixels relative to maps's zoom. |
| [options.gridSquareSidelength] | <code>string</code> | <code>15</code> | Side length of a square in pixels relative to maps's zoom. |
| [options.filterEmptyShapes] | <code>boolean</code> | <code>false</code> | Enables rendering of empty shapes. |
| [options.emptyShapesColor] | <code>string</code> | <code>&quot;rgba(255,255,255, 0)&quot;</code> | Fill color of shapes where points count equals 0. |
| options.shapeColor | <code>getColor</code> |  | function which calculates shapes fill color. |
| [options.strokeColor] | <code>string</code> | <code>&quot;#666&quot;</code> | Color of shapes stroke. |
| [options.strokeWidth] | <code>number</code> | <code>1</code> | Width of shapes stroke. |
| options.getHotspotProps | <code>getHotspotProps</code> |  | Properties of hotspot layer. |
| [options.hotspotLayerOptions] | <code>Object</code> |  | Options of hotspot layer. $[https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/hotspot.Layer-docpage/#param-options](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/hotspot.Layer-docpage/#param-options) |
| [options.hotspotLayerOptions.zIndex] | <code>number</code> | <code>201</code> | zIndex of a hotspot. |
| [options.hotspotLayerOptions.cursor] | <code>Object</code> | <code>pointer</code> | Cursor of a hotspot. |
| options.onMouseEnter | <code>eventCallback</code> |  |  |
| options.onMouseLeave | <code>eventCallback</code> |  |  |
| options.onClick | <code>eventCallback</code> |  |  |
| options.onBalloonClose | <code>eventCallback</code> |  |  |
| options.balloonContent | <code>getHotspotProps</code> |  | calculates balloon's properties |
| [options.interactivity] | <code>boolean</code> | <code>true</code> | enables default interactivity |

<a name="module_GridmapLayer--GridmapLayer..tileTransparent"></a>

#### GridmapLayer~tileTransparent
This is necessary because otherwise tiles are rendered
on top of the previously rendered tiles that create a weird effect.

**Kind**: inner property of [<code>GridmapLayer</code>](#exp_module_GridmapLayer--GridmapLayer)  
<a name="module_GridmapLayer--GridmapLayer..IFeatureGeometry"></a>

#### GridmapLayer~IFeatureGeometry : <code>Object</code>
**Kind**: inner typedef of [<code>GridmapLayer</code>](#exp_module_GridmapLayer--GridmapLayer)  
**Properties**

| Name | Type |
| --- | --- |
| type | <code>string</code> | 
| coordinates | <code>Array.&lt;number&gt;</code> | 

<a name="module_GridmapLayer--GridmapLayer..IFeature"></a>

#### GridmapLayer~IFeature : <code>Object</code>
**Kind**: inner typedef of [<code>GridmapLayer</code>](#exp_module_GridmapLayer--GridmapLayer)  
**Properties**

| Name | Type |
| --- | --- |
| type | <code>string</code> | 
| geometry | <code>IFeatureGeometry</code> | 
| properties | <code>Object</code> | 

<a name="module_GridmapLayer--GridmapLayer..IFeatureCollection"></a>

#### GridmapLayer~IFeatureCollection : <code>Object</code>
**Kind**: inner typedef of [<code>GridmapLayer</code>](#exp_module_GridmapLayer--GridmapLayer)  
**Properties**

| Name | Type |
| --- | --- |
| type | <code>string</code> | 
| features | <code>Array.&lt;IFeature&gt;</code> | 

<a name="module_GridmapLayer--GridmapLayer..getHotspotProps"></a>

#### GridmapLayer~getHotspotProps ⇒ <code>HotspotObjectProps</code>
**Kind**: inner typedef of [<code>GridmapLayer</code>](#exp_module_GridmapLayer--GridmapLayer)  

| Type |
| --- |
| <code>Array.&lt;IFeature&gt;</code> | 

<a name="module_GridmapLayer--GridmapLayer..getColor"></a>

#### GridmapLayer~getColor ⇒ <code>string</code>
**Kind**: inner typedef of [<code>GridmapLayer</code>](#exp_module_GridmapLayer--GridmapLayer)  

| Type |
| --- |
| <code>Array.&lt;IFeature&gt;</code> | 

<a name="module_GridmapLayer--GridmapLayer..eventCallback"></a>

#### GridmapLayer~eventCallback : <code>function</code>
**Kind**: inner typedef of [<code>GridmapLayer</code>](#exp_module_GridmapLayer--GridmapLayer)  

| Param | Type | Description |
| --- | --- | --- |
| event | <code>IEvent</code> | [https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IEvent-docpage/](https://tech.yandex.ru/maps/doc/jsapi/2.1/ref/reference/IEvent-docpage/) |

<a name="module_HotspotObjectSourceBrowser"></a>

## HotspotObjectSourceBrowser
HotspotObjectSourceBrowser.

**Requires**: <code>module:util.defineClass</code>, <code>module:util.extend</code>, <code>module:hotspot.ObjectSource</code>  

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
