import {Layer} from '../../map/Layer';

import {SourceWMTS} from '../SourceWMTS';
import {TileMatrix} from './TileMatrix';
import {TileMatrixSet} from './TileMatrixSet';

export class LayerWMTS extends Layer {

	/** Parse Layer element in WMTS GetCapabilities XML. */

	parseCapabilities(xml: any, source: SourceWMTS) {
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

	getMatrixForZoom(zoom: number) {
		return(this.tileMatrixSet.getMatrixForZoom(zoom));
	}

	getScaleForZoom(zoom: number) {
		if(zoom == ~~zoom) return(this.tileMatrixSet.getMatrixForZoom(zoom).scale);

		var zoomInt = ~~zoom;
		var matrix1 = this.tileMatrixSet.getMatrixForZoom(zoomInt);
		var matrix2 = this.tileMatrixSet.getMatrixForZoom(zoomInt + 1);

		var scale1 = matrix1.scale;
		var scale2 = matrix2.scale;

		if(scale2 == scale1) scale2 = scale1 * 2;

		var scale = scale1 * Math.pow(scale2 / scale1, zoom - zoomInt);

		return(scale);
	}

	getMatrixForScale(scale?: number) {
		return(this.tileMatrixSet.getMatrixForScale(scale));
	}

	getZoomForScale(scale?: number) {
		var matrix1 = this.tileMatrixSet.getMatrixForScale(scale);

		if(matrix1.scale == scale) return(matrix1.zoom);

		var zoomInt = matrix1.zoom;
		var matrix2 = this.tileMatrixSet.getMatrixForZoom(zoomInt + 1);

		var scale1 = matrix1.scale;
		var scale2 = matrix2.scale;

		if(scale2 == scale1) scale2 = scale1 * 2;

		var zoom = zoomInt + Math.log(scale / scale1) / Math.log(scale2 / scale1);

		return(zoom);
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
