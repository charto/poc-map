import * as L from 'leaflet';

import {Map} from '../map/Map';
import {LayerWMTS} from '../source/wmts/LayerWMTS';
import {TileMatrix} from '../source/wmts/TileMatrix';

import {LeafletCRS} from './leaflet/LeafletCRS';
import {LeafletLayerWMTS} from './leaflet/LeafletLayerWMTS';

export class LeafletMap extends Map {
	constructor(idDom: string) {
		super();

		var lmap = L.map(idDom, {
			crs: new LeafletCRS(this)
		});

		L.control.scale().addTo(lmap);

		this.lmap = lmap;
	}

	setBaseLayer(layer: LayerWMTS) {
		var lmap = this.lmap;

		super.setBaseLayer(layer);

		var matrix = layer.getTileMatrix();

		var S = matrix.bottom;
		var W = matrix.left;
		var N = matrix.top;
		var E = matrix.right;

		var base = new LeafletLayerWMTS(
			layer,
			{
				minZoom: 0,
				maxZoom: layer.getZoomMax(),
				continuousWorld: true, // Must be true for L.CRS.Simple or similar.
				noWrap: true
			}
		);

		lmap.addLayer(base);

	//	var e = 385789 * -4;
	//	var n = 6672204 * 1.18;

		var e = 385789;
		var n = 6672204;

	/*
		map.setMaxBounds(L.latLngBounds(
			map.unproject(new L.Point(0, 0), 13),
			map.unproject(new L.Point(E - W, N - S), 13)
		));
	*/

		lmap.setView(lmap.unproject(new L.Point(e - W, N - n), 13), 9, {
	//	map.setView(map.unproject(new L.Point(e - W, N - n), 7), 3, {
			pan: { animate: false },
			zoom: { animate: false }
		});
	}

	lmap: L.Map;
}
