import {SourceRest} from './SourceRest';

export class SourceOWS extends SourceRest {

	init() {
		if(!this.loading) {
			this.loading = this.fetchXML().then((xml: any) => {
				this.parseCapabilities(xml);
			});
		}

		return(this.loading);
	}

	/** Parse GetCapabilities XML document. */

	parseCapabilities(xml: any) {
		if(!xml.OperationsMetadata || !xml.OperationsMetadata.Operation) return;

		for(var spec of xml.OperationsMetadata.Operation) {
			for(var specGet of this.forceArray(spec.DCP.HTTP.Get)) {
				var allowedTbl: {[code: string]: boolean} = null;

				for(var specConstraint of this.forceArray(specGet.Constraint)) {
					if(specConstraint.name != 'GetEncoding') continue;

					if(!allowedTbl) allowedTbl = {};

					for(var specAllowed of this.forceArray(specConstraint.AllowedValues)) {
						allowedTbl[specAllowed.Value] = true;
					}
				}

				if(!allowedTbl || allowedTbl['RESTful']) {
					this.apiUrlTbl[spec.name] = specGet.href;
				}
			}
		}
	}

	/** API endpoint URLs for different types of requests. Probably
	  * identical, but the spec allows servers to vary them. */

	apiUrlTbl = {} as {
		[name: string]: string,

		DescribeFeatureType: string,
		GetCapabilities: string,
		GetFeature: string
	};
}
