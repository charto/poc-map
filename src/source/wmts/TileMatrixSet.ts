import {TileMatrix} from './TileMatrix';

/** Represents the tiling of all WMTS zoom levels. */

export class TileMatrixSet {

	/** Parse TileMatrixSet element in WMTS GetCapabilities XML. */

	parseCap(xml: any) {
		this.id = xml.Identifier;
		this.crsCode = xml.SupportedCRS;

		var matrixSpecList = xml.TileMatrix;

		if(!(matrixSpecList instanceof Array)) matrixSpecList = [matrixSpecList];

		for(var matrixSpec of matrixSpecList) {
			var matrix = new TileMatrix();

			matrix.parseCap(matrixSpec);

			this.matrixList.push(matrix);
		}

		this.matrixList.sort((a: TileMatrix, b: TileMatrix) => b.scale - a.scale);

		var scale0 = this.matrixList[0].scale;

		for(var matrix of this.matrixList) {
			matrix.scaleRelative = scale0 / matrix.scale;
		}
	}

	getZoomMax() {
		return(this.matrixList.length - 1);
	}

	/** List of tile matrices, one per zoom level. */
	matrixList: TileMatrix[] = [];
	/** Matrix set ID, referenced in XML by layers using this tile set. */
	id: string;
	/** Coordinate reference system, preferably an EPSG code. */
	crsCode: string;
}
