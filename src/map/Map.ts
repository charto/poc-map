import {SourceRest} from '../source/SourceRest';
import {Layer} from './Layer';
import {LayerWMTS} from '../source/wmts/LayerWMTS';

export class Map {
	addSource(source: SourceRest) {
		return(source.init().then(() => {
			for(var layer of source.getLayerList()) {
				this.foundLayer(layer);
			}
		}));
	}

	foundLayer(layer: Layer) {}

	setBaseLayer(layer: LayerWMTS) {
		this.baseLayer = layer;
	}

	baseLayer: LayerWMTS;
}
