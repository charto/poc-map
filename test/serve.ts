import * as fs from 'fs';
import * as url from 'url';
import * as path from 'path';
import * as http from 'http';

var basePath = '..';

var port = +process.argv[2] || 6630;

basePath = path.resolve(__dirname, basePath);

var encoding = '; charset=utf-8';

var mimeTbl: {[extension: string]: string} = {
	css: 'text/css' + encoding,
	html: 'text/html' + encoding,
	js: 'text/javascript',
	xml: 'text/xml',
	png: 'image/png'
};

function report(res: http.ServerResponse, status: number, header?: Object) {
	res.writeHead(status, header || {});
	res.end();
}

/** This is a minimal (but hopefully secure) web server to open the frontend in a browser.
  * A proper backend also with nicer development features will be a separate package. */

var app = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
	console.log(req.url);

	var urlParts = url.parse(req.url);

	// Paths must start with / and contain maximum one consecutive special character
	// between alphanumeric characters.

	var pathParts = urlParts.pathname.match(/^\/([0-9A-Za-z]+[-_./@]?)*/);

	// Reject all invalid paths.

	if(!pathParts) return(report(res, 403));

	var urlPath = pathParts[0];

	// Redirect root to the www directory.

	if(urlPath == '/') return(report(res, 302, {
		'Location': '/www/' + (urlParts.search || '')
	}));

	// Silently redirect obvious directory paths (ending with a slash) to an index file.

	if(urlPath.match(/\/$/)) urlPath += 'index.html';

	try {
		// Drop initial slash from path and use platform specific path
		// separators (for Windows).

		var filePath = path.join(basePath, urlPath.substr(1).replace(/\//g, path.sep));

		var stats = fs.statSync(filePath);

		// Redirect accesses to directories not marked as such; append a slash.

		if(stats.isDirectory()) return(report(res, 302, {
			'Location': urlPath + '/' + (urlParts.search || '')
		}));

		// OK, serve the file.

		var extension = urlPath.substr(urlPath.lastIndexOf('.') + 1);

		res.writeHead(200, {
			'Content-Type': mimeTbl[extension] || 'text/plain' + encoding,
			'Content-Length': stats.size
		});

		fs.createReadStream(filePath).pipe(res);
	} catch(err) {
		report(res, 404);
	}
});

app.listen(port, () => {
	console.log('Listening on port ' + port);
}).on('error', (err: NodeJS.ErrnoException) => {
	if(err.code == 'EACCES' || err.code == 'EADDRINUSE') {
		console.error('Error binding to port ' + port);
		console.error('Try a different one as argument, like npm start -- 8080');
	} else throw(err);
});
