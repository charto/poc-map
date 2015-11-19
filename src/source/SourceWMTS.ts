import {SourceOWS} from './SourceOWS';

import {TileMatrix} from './wmts/TileMatrix';
import {TileMatrixSet} from './wmts/TileMatrixSet';
import {LayerWMTS} from './wmts/LayerWMTS';

/** Represents a WMTS API endpoint. */

export class SourceWMTS extends SourceOWS {

	/** Parse tile matrix sets from GetCapabilities. */

	private parseCapMatrixSets(setSpecList: any) {
		for(var setSpec of this.forceArray(setSpecList)) {
			var matrixSet = new TileMatrixSet();

			matrixSet.parseCapabilities(setSpec);

			if(matrixSet.id) this.tileMatrixSetTbl[matrixSet.id] = matrixSet;
		}
	}

	/** Parse layers from GetCapabilities. */

	private parseCapLayers(layerSpecList: any) {
		for(var layerSpec of this.forceArray(layerSpecList)) {
			var layer = new LayerWMTS();

			layer.parseCapabilities(layerSpec, this);

			if(layer.id) {
				this.layerTbl[layer.id] = layer;
				this.layerList.push(layer);
			}
		}

		this.sortLayers();
	}

	/** Parse WMTS GetCapabilities XML document. */

	parseCapabilities(xml: any) {
		super.parseCapabilities(xml.Capabilities);

		this.parseCapMatrixSets(xml.Capabilities.Contents.TileMatrixSet);
		this.parseCapLayers(xml.Capabilities.Contents.Layer);
	}

	/** Get tile matrix set by ID. */

	getTileMatrixSet(id: string) {
		return(this.tileMatrixSetTbl[id]);
	}

	/** Tile matrix sets in this WMTS API endpoint, indexed by ID. */
	private tileMatrixSetTbl: {[id: string]: TileMatrixSet} = {};
}
