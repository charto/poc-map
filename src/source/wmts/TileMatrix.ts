/** Represents the tiling of a single WMTS zoom level. */

export class TileMatrix {

	/** Parse TileMatrix element in WMTS GetCapabilities XML. */

	parseCap(xml: any) {
		var tileSizeOverride = 256;

		this.id = xml.Identifier;

		var metersPerPixel = +xml.ScaleDenominator * TileMatrix.microMetersPerPixelWMTS / 1000000;
		this.pixelsPerMeter = 1000000 / (+xml.ScaleDenominator * TileMatrix.microMetersPerPixelWMTS);

		this.tileWidth = +xml.TileWidth;
		this.tileHeight = +xml.TileHeight;

		this.scale = this.pixelsPerMeter / (this.tileWidth / tileSizeOverride);

		this.widthInTiles = +xml.MatrixWidth;
		this.heightInTiles = +xml.MatrixHeight;

		this.widthInPixels = this.widthInTiles * this.tileWidth;
		this.heightInPixels = this.heightInTiles * this.tileHeight;

		var cornerParts = xml.TopLeftCorner.split(' ');

		this.left = +cornerParts[0];
		this.top = +cornerParts[1];

		/** Coordinate rounding, to avoid floating point inaccuracies later.
		  * 1024 gives about 3 decimals, exactly representable in base 2. */

		var rounding = 1024;

		this.right = Math.round(
			(this.left + this.widthInPixels * metersPerPixel) * rounding
		) / rounding;
		this.bottom = Math.round(
			(this.top - this.heightInPixels * metersPerPixel) * rounding
		) / rounding;
	}

	/** ID passed as the z parameter in WMTS tile URLs. */
	id: string;

	zoom: number;

	/** Physical pixel size at this zoom level. */
	pixelsPerMeter: number;

	scale: number;

	/** Layer's top edge in layer's CRS (eg. in meters) */
	top: number;
	/** Layer's left edge in layer's CRS (eg. in meters) */
	left: number;
	/** Layer's bottom edge in layer's CRS (eg. in meters) */
	bottom: number;
	/** Layer's right edge in layer's CRS (eg. in meters) */
	right: number;

	/** Width of a single tile in pixels, usually 256. */
	tileWidth: number;
	/** Height of a single tile in pixels, usually 256. */
	tileHeight: number;

	/** Horizontal number of tiles at this zoom level. */
	widthInTiles: number;
	/** Vertical number of tiles at this zoom level. */
	heightInTiles: number;

	/** Layer width at this zoom level. */
	widthInPixels: number;
	/** Layer height at this zoom level. */
	heightInPixels: number;

	/** Standard physical pixel size as defined in the WMTS specification. */
	static microMetersPerPixelWMTS = 280;
}
