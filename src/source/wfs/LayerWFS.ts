import {Layer} from '../../map/Layer';

import {SourceWFS} from '../SourceWFS';

export class LayerWFS extends Layer {

	/** Parse FeatureType element in WFS GetCapabilities XML. */

	parseCapabilities(xml: any, source: SourceWFS) {
		this.id = xml.Name;
		this.title = xml.Title;
	}

	getZoomMax() {
		return(Infinity);
	}
}
