import * as _Promise from 'bluebird';

export var Promise = _Promise;

// Make Promise work with SystemJS in the browser.

if((Promise as any).Promise) Promise = (Promise as any).Promise;
