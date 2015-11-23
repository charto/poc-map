import {TileMatrix} from './TileMatrix';
import {BSearch} from '../../util/BSearch';

/** Represents the tiling of all WMTS zoom levels. */

export class TileMatrixSet {

	/** Parse TileMatrixSet element in WMTS GetCapabilities XML. */

	parseCapabilities(xml: any) {
		var matrix: TileMatrix;

		this.id = xml.Identifier;
		this.crsCode = xml.SupportedCRS;

		var matrixSpecList = xml.TileMatrix;

		if(!(matrixSpecList instanceof Array)) matrixSpecList = [matrixSpecList];

		for(var matrixSpec of matrixSpecList) {
			matrix = new TileMatrix();

			matrix.parseCap(matrixSpec);

			this.matrixList.push(matrix);
		}

		this.matrixList.sort((a: TileMatrix, b: TileMatrix) => a.scale - b.scale);

		for(var zoom = 0; zoom < this.matrixList.length; ++zoom) {
			matrix = this.matrixList[zoom];

			matrix.zoom = zoom;

			this.scaleToMatrixTbl[matrix.scale] = matrix;
		}
	}

	getMatrixForZoom(zoom: number) {
		if(zoom < 0) zoom = 0;
		if(zoom > this.matrixList.length - 1) zoom = this.matrixList.length - 1;

		return(this.matrixList[zoom]);
	}

	getMatrixForScale(scale: number) {
		return(
			this.scaleToMatrixTbl[scale] ||
			this.matrixList[BSearch.upto(scale, this.matrixList, (scale, matrix) => scale - matrix.scale)]
		);
	}

	getZoomMax() {
		return(this.matrixList.length - 1);
	}

	/** List of tile matrices, one per zoom level. */
	matrixList: TileMatrix[] = [];
	scaleToMatrixTbl: {[scale: number]: TileMatrix} = {};
	/** Matrix set ID, referenced in XML by layers using this tile set. */
	id: string;
	/** Coordinate reference system, preferably an EPSG code. */
	crsCode: string;
}
