import {LayerWMTS} from '../source/wmts/LayerWMTS';

export class Map {
	setBaseLayer(layer: LayerWMTS) {
		this.baseLayer = layer;
	}

	baseLayer: LayerWMTS;
}
