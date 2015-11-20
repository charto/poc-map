import * as L from 'leaflet';

import {TileMatrix} from '../../source/wmts/TileMatrix';
import {LeafletMap} from '../LeafletMap'

/** Custom projection using pixels as map units. */

export class LeafletProjection implements L.IProjection {
	project(ll: L.LatLng) {
		return new L.Point(ll.lng, -ll.lat);
	}

	unproject(xy: L.Point) {
		return new L.LatLng(-xy.y, xy.x);
	}
};

export class LeafletTransformation implements L.Transformation {
	constructor(lmap: LeafletMap) {
		this.lmap = lmap;
	}

	transform(xy: L.Point, scale?: number) {
		return this._transform(new L.Point(xy.x, xy.y), scale);
	}

	_transform(xy: L.Point, scale?: number) {
		var matrix: TileMatrix;
		var layer = this.lmap.baseLayer;

		if(layer) matrix = layer.getTileMatrix(layer.getZoomForScale(scale));

		if(matrix) {
			xy.x -= matrix.left;
			xy.y += matrix.top;
		}

		xy.x *= scale;
		xy.y *= scale;

		return(xy);
	}

	untransform(xy: L.Point, scale?: number) {
		var matrix: TileMatrix;
		var layer = this.lmap.baseLayer;
		var left = 0, top = 0;

		if(layer) matrix = layer.getTileMatrix(layer.getZoomForScale(scale));

		if(matrix) {
			left = matrix.left;
			top = matrix.top;
		}

		return new L.Point(xy.x / scale + left, xy.y / scale - top);
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

		this.transformation = new LeafletTransformation(lmap);

		this.lmap = lmap;
	}

	scale(zoom: number) {
		var matrix: TileMatrix;

		if(this.lmap.baseLayer) matrix = this.lmap.baseLayer.getTileMatrix(zoom);

		if(matrix) return(matrix.scale);

		console.log('No scale for zoom ' + zoom);
		return((1 << (zoom + 1)) / 2);
	}

	zoom(scale: number) {
		var zoom = -1;

		if(this.lmap.baseLayer) zoom = this.lmap.baseLayer.getZoomForScale(scale);

		if(zoom >= 0) return(zoom);

		console.log('No zoom for scale ' + scale);
		return((1 << (zoom + 1)) / 2);
	}

	distance(ll1: L.LatLng, ll2: L.LatLng) {
		var dlat = ll2.lat - ll1.lat;
		var dlon = ll2.lng - ll1.lng;

		return Math.sqrt(dlat * dlat + dlon * dlon);
	}

	projection = new LeafletProjection();
	transformation: LeafletTransformation;

	infinite = true;

	private lmap: LeafletMap;
}
