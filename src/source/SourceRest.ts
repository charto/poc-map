import {Promise} from '../util/Promise';
import {Fetcher} from '../util/Fetcher';
import {ParserXML} from '../parser/ParserXML';
import {Layer} from '../map/Layer';

export class SourceRest {
	constructor(urlRemote: string) {
		this.urlRemote = urlRemote;
	}

	protected fetchXML() {
		if(!this.loading) {
			this.loading = new Fetcher().fetch(this.urlRemote).then(
				(xhr: XMLHttpRequest) => new ParserXML().parse(xhr.responseXML)
			);
		}

		return(this.loading);
	}

	init() {
		return(this.fetchXML());
	}

	/** Get layer by ID. */

	getLayer(id: string) {
		return(this.layerTbl[id]);
	}

	getLayerList() {
		return(this.layerList);
	}

	private urlRemote: string;

	protected loading: Promise<any>;

	/** Layers in this WMTS API endpoint, indexed by ID. */
	protected layerTbl: {[id: string]: Layer} = {};

	protected layerList: Layer[] = [];
}
