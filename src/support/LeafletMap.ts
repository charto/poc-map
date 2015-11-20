import 'leaflet.css!'
import * as L from 'leaflet';

import {Map} from '../map/Map';
import {Layer} from '../map/Layer';

import {SourceWMTS} from '../source/SourceWMTS';
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

		this.lmap = lmap;

		this.createBaseLayer();
		this.createLayerSwitcher();

		L.control.scale().addTo(lmap);
	}

	private createBaseLayer() {
		var base = new LeafletLayerWMTS(
			{
				minZoom: 0,
				maxZoom: Infinity,
				continuousWorld: true, // Must be true for L.CRS.Simple or similar.
				noWrap: true
			}
		);

		this.lmap.addLayer(base);

		this.baseLayerLeaflet = base;
	}

	foundLayer(layer: Layer) {
		var leafletLayer = new L.LayerGroup();

		(leafletLayer as any).chartoLayer = layer;

		if(this.layerControl) {
			if(layer instanceof LayerWMTS) {
				this.layerControl.addBaseLayer(leafletLayer, layer.title);
			} else {
				this.layerControl.addOverlay(leafletLayer, layer.title);
			}
		}
	}

	private createLayerSwitcher() {
		this.layerControl = L.control.layers({}, {}, {
			position: 'topright',
			collapsed: true
		});

		this.layerControl.addTo(this.lmap);

		this.lmap.on('baselayerchange', (e: L.LeafletLayersControlEvent) => {
			this.setBaseLayer((e.layer as any).chartoLayer);
		});
	}

	setBaseLayer(layer: LayerWMTS) {
		var lmap = this.lmap;

		super.setBaseLayer(layer);

	/*
		map.setMaxBounds(L.latLngBounds(
			map.unproject(new L.Point(0, 0), 13),
			map.unproject(new L.Point(E - W, N - S), 13)
		));
	*/

		this.baseLayerLeaflet.switchLayer(layer);

		lmap.setView(new L.LatLng(6672204, 385789), 2, {
			pan: { animate: false },
			zoom: { animate: false }
		});
	}

	lmap: L.Map;
	layerControl: L.Control.Layers;

	baseLayerLeaflet: LeafletLayerWMTS;
}
