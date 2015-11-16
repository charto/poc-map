import {SourceWMTS} from './source/SourceWMTS';
import {LayerWMTS} from './source/wmts/LayerWMTS';
import {LeafletMap} from './support/LeafletMap'

var map = new LeafletMap('map');

var wmts = new SourceWMTS('http://geoserver.hel.fi/mapproxy/wmts/1.0.0/WMTSCapabilities.xml');

map.addSource(wmts).then(() => {
	map.setBaseLayer(wmts.getLayer('osm-sm') as LayerWMTS);
});
