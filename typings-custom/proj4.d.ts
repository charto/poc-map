declare module "proj4" {
	var proj4: (from: string, to: string, xy: number[]) => number[];
	export = proj4;
}
