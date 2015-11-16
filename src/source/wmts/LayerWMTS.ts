import {Layer} from '../../map/Layer';

import {SourceWMTS} from '../SourceWMTS';
import {TileMatrix} from './TileMatrix';
import {TileMatrixSet} from './TileMatrixSet';

export class LayerWMTS extends Layer {

	/** Parse Layer element in WMTS GetCapabilities XML. */

	parseCap(xml: any, source: SourceWMTS) {
		this.id = xml.Identifier;
		this.title = xml.Title;

		this.tileMatrixSet = source.getTileMatrixSet(xml.TileMatrixSetLink.TileMatrixSet);

		this.urlTemplate = xml.ResourceURL.template;

		var styleList = xml.Style;

		if(!(styleList instanceof Array)) styleList = [styleList];

		this.styleTbl = {};
		this.defaultStyle = null;

		for(var styleSpec of styleList) {
			this.styleTbl[styleSpec.Identifier] = styleSpec.Title || '';
			if(styleSpec.isDefault || !this.defaultStyle) {
				this.defaultStyle = styleSpec.Identifier;
			}
		}
	}

	getZoomMax() {
		return(this.tileMatrixSet.getZoomMax());
	}

	/** Get tile matrix for a single zoom level. */

	getTileMatrix(zoom?: number) {
		return(this.tileMatrixSet.matrixList[zoom || 0]);
	}

	/** Format of URL addresses of individual tiles. */
	urlTemplate: string;

	/** Details of zoom levels available for this layer. */
	tileMatrixSet: TileMatrixSet;
	/** Available drawing style IDs and their human-readable names. */
	styleTbl: {[id: string]: string};
	/** Default drawing style ID. */
	defaultStyle: string;
}
