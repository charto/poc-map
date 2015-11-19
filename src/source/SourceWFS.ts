import {SourceOWS} from './SourceOWS';

import {LayerWFS} from './wfs/LayerWFS';

/** Represents a WFS API endpoint. */

// http://geoserver.hel.fi/geoserver/seutukartta/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=seutukartta:Viheralueet&maxFeatures=1000000&outputFormat=csv

export class SourceWFS extends SourceOWS {

	/** Parse WFS GetCapabilities XML document. */

	parseCapabilities(xml: any) {
		super.parseCapabilities(xml.WFS_Capabilities);

		for(var layerSpec of this.forceArray(xml.WFS_Capabilities.FeatureTypeList.FeatureType)) {
			var layer = new LayerWFS();

			layer.parseCapabilities(layerSpec, this);

			if(layer.id) {
				this.layerTbl[layer.id] = layer;
				this.layerList.push(layer);
			}
		}

		this.sortLayers();
	}
}
