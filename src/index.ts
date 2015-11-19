import {SourceWMTS} from './source/SourceWMTS';
import {SourceWFS} from './source/SourceWFS';

import {LayerWMTS} from './source/wmts/LayerWMTS';
import {LeafletMap} from './support/LeafletMap'

var map = new LeafletMap('map');

var wmts = new SourceWMTS('http://geoserver.hel.fi/mapproxy/wmts/1.0.0/WMTSCapabilities.xml');
var wfs = new SourceWFS('http://geoserver.hel.fi/geoserver/ows?service=WFS&version=1.1.0&request=GetCapabilities');

Promise.all([wmts, wfs].map((source: SourceWMTS) =>
	map.addSource(source)
)).then(() => {
	map.setBaseLayer(wmts.getLayer('osm-sm') as LayerWMTS);
});
