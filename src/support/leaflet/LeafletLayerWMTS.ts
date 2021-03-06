import * as L from 'leaflet';

import {LayerWMTS} from '../../source/wmts/LayerWMTS';

export class LeafletLayerWMTS extends L.TileLayer {
	constructor(options: L.TileLayerOptions) {
		super('', options);
	}

	switchLayer(layer: LayerWMTS) {
		this.chartoLayer = layer;
		this.redraw();
	}

	getTileUrl(xy: L.Point) {
		var layer = this.chartoLayer;

		if(!layer) return('');

		var zoom = Math.min(
			this._map.getZoom() + this.options.zoomOffset,
			this.options.maxNativeZoom || Infinity
		);

		var keyTbl: {[key: string]: string | number} = {
			Style: layer.defaultStyle,
			TileMatrixSet: layer.tileMatrixSet.id,
			TileMatrix: layer.getTileMatrix(zoom).id,
			TileCol: xy.x,
			TileRow: xy.y
		};

		var url = layer.urlTemplate.replace(
			/\{([^}]+)\}/g,
			(dummy: string, key: string) => '' + keyTbl[key]
		);

		return(url);
	}

	chartoLayer: LayerWMTS;
	options: L.TileLayerOptions;
	_map: L.Map;
}
