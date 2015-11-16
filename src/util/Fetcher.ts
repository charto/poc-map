import {Promise} from './Promise';

export class Fetcher {
	fetch(urlRemote: string) {
		var resolve: (result: any) => void;
		var reject: (err: any) => void;
		var promise = new Promise<XMLHttpRequest>((res, rej) => {
			resolve = res;
			reject = rej;
		});

		var xhr = new XMLHttpRequest();

		xhr.onreadystatechange = function(evt: ProgressEvent) {
			var xhr = this as XMLHttpRequest;

			if(xhr.readyState == (xhr.DONE || 4)) {
				if(xhr.status == 200) {
					try {
						resolve(xhr);
					} catch(err) {
						reject(err);
					}
				} else {
					reject(null);
				}
			}
		};

		xhr.open('GET', urlRemote, true);
		xhr.send();

		return(promise);
	}
}
