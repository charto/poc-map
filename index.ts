import 'leaflet.css!'

import * as Promise from 'bluebird';
import * as L from 'leaflet';

import {Map} from './src/map/Map';
import {ParserXML} from './src/parser/ParserXML';
import {SourceWMTS} from './src/source/SourceWMTS';
import {LayerWMTS} from './src/source/wmts/LayerWMTS';
import {TileMatrix} from './src/source/wmts/TileMatrix';
import {LeafletMap} from './src/support/LeafletMap'

// Make Promise work with SystemJS in the browser.

eval('if(Promise.Promise) Promise = Promise.Promise;');

class Fetcher {
	fetch(urlRemote: string) {
		var resolve: (result: any) => void;
		var reject: (err: any) => void;
		var promise = new Promise<XMLHttpRequest>((res, rej) => {
			resolve = res;
			reject = rej;
		});

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(evt: ProgressEvent) {
			var xhr = this as XMLHttpRequest;

			if(xhr.readyState == (xhr.DONE || 4)) {
				if(xhr.status == 200) {
					try {
						resolve(xhr);
					} catch(err) {
						reject(err);
					}
				} else {
					reject(null);
				}
			}
		};

		xhr.open('GET', urlRemote, true);
		xhr.send();

		return(promise);
	}
}

var parser = new ParserXML();

new Fetcher().fetch('http://geoserver.hel.fi/mapproxy/wmts/1.0.0/WMTSCapabilities.xml').then(
	(xhr: XMLHttpRequest) => parser.parse(xhr.responseXML)
).then((xml: any) => {
	var source = new SourceWMTS();
	source.parseCap(xml);

	new LeafletMap('map').setBaseLayer(source.getLayer('osm-sm'));
});
