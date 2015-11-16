import {TileMatrix} from './wmts/TileMatrix';
import {TileMatrixSet} from './wmts/TileMatrixSet';
import {LayerWMTS} from './wmts/LayerWMTS';

/** Represents a WMTS API endpoint. */

export class SourceWMTS {

	/** Parse tile matrix sets from GetCapabilities. */

	private parseCapMatrixSets(setSpecList: any) {
		// TODO: With proper XSD schema support, setSpecList should always be an array
		// in ParserXML output.

		if(!(setSpecList instanceof Array)) setSpecList = [setSpecList];

		for(var setSpec of setSpecList) {
			var matrixSet = new TileMatrixSet();

			matrixSet.parseCap(setSpec);

			if(matrixSet.id) this.tileMatrixSetTbl[matrixSet.id] = matrixSet;
		}
	}

	/** Parse layers from GetCapabilities. */

	private parseCapLayers(layerSpecList: any) {
		if(!(layerSpecList instanceof Array)) layerSpecList = [layerSpecList];

		for(var layerSpec of layerSpecList) {
			var layer = new LayerWMTS();

			layer.parseCap(layerSpec, this);

			if(layer.id) {
				this.layerTbl[layer.id] = layer;
				this.layerList.push(layer);
			}
		}

		this.layerList.sort((a: LayerWMTS, b: LayerWMTS) => a.id.localeCompare(b.id));
	}

	/** Parse WMTS GetCapabilities XML document. */

	parseCap(xml: any) {
		this.parseCapMatrixSets(xml.Capabilities.Contents.TileMatrixSet);
		this.parseCapLayers(xml.Capabilities.Contents.Layer);
	}

	/** Get layer by ID. */

	getLayer(id: string) {
		return(this.layerTbl[id]);
	}

	getLayerList() {
		return(this.layerList);
	}

	/** Get tile matrix set by ID. */

	getTileMatrixSet(id: string) {
		return(this.tileMatrixSetTbl[id]);
	}

	/** Tile matrix sets in this WMTS API endpoint, indexed by ID. */
	private tileMatrixSetTbl: {[id: string]: TileMatrixSet} = {};

	/** Layers in this WMTS API endpoint, indexed by ID. */
	private layerTbl: {[id: string]: LayerWMTS} = {};

	private layerList: LayerWMTS[] = [];
}
