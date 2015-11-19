import {Promise} from 'es6-promise';

import {SourceWMTS} from '../src/source/SourceWMTS';
import {SourceWFS} from '../src/source/SourceWFS';

import {Map} from '../src/map/Map'

var map = new Map();

var wmts = new SourceWMTS('WMTSCapabilities.xml');
var wfs = new SourceWFS('WFSCapabilities.xml');

Promise.all([wmts, wfs].map((source: SourceWMTS) =>
//	map.addSource(source)
	true
)).then(() => {
	console.log('OK');
});
