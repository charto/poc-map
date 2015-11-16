import * as L from 'leaflet';

import {TileMatrix} from '../../source/wmts/TileMatrix';
import {LeafletMap} from '../LeafletMap'

/** Custom projection using pixels as map units. */

export class LeafletProjection implements L.IProjection {
	constructor(lmap: LeafletMap) {
		this.lmap = lmap;
	}

	project(ll: L.LatLng) {
		return new L.Point(-ll.lat, ll.lng);

	}
	unproject(xy: L.Point) {
		return new L.LatLng(-xy.x, xy.y);
	}

	private lmap: LeafletMap;
};

/** Hack to get ChartoCRS to implement L.ICRS by inheriting from L.CRS
  * which is an object, not a class. */

function LeafletBaseCRS() {}

LeafletBaseCRS.prototype = L.CRS;

/** Custom CRS that uses zoom levels configured in the background map. */

export class LeafletCRS extends (LeafletBaseCRS as any as {new(): L.ICRS}) {
	// Fix atom-typescript syntax highlight: )

	constructor(lmap: LeafletMap) {
		super();

		this.projection = new LeafletProjection(lmap);

		this.lmap = lmap;
	}

	scale(zoom: number) {
		var matrix: TileMatrix;

		if(this.lmap.baseLayer) matrix = this.lmap.baseLayer.getTileMatrix(zoom);

		if(matrix) return(matrix.scaleRelative);

		console.log('No scale for ' + zoom);
		return((1 << (zoom + 1)) / 2);
	}

	projection: LeafletProjection;
	transformation = new L.Transformation(1, 0, 1, 0);

	private lmap: LeafletMap;
}
