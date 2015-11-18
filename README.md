Proof of concept automatic map visualizer
===

`poc-map` is a map frontend to show map layers published on [GeoServer](http://geoserver.org/)
or similar. No other backend component is needed.
The only configuration required to get started are the URL addresses of map services to use.
It reads available layers, zoom levels, projections and available coordinate bounds automatically.

Currently only WMTS is supported.

Installation
---

```bash
git clone https://github.com/charto/poc-map.git
cd poc-map
npm install
npm start
```

Then, open [localhost:6630](http://localhost:6630/) in a web browser.

Technology
---

All of the following are installed automatically.

Currently the frontend uses:

- [Leaflet](http://leafletjs.com/)
- [SystemJS](https://github.com/systemjs/systemjs)

Additionally, building requires:

- [TypeScript](http://www.typescriptlang.org/)
- [JSPM](http://jspm.io/)

The code is entirely in TypeScript.
Recommended development tool is [Atom](https://atom.io/) with [atom-typescript](https://atom.io/packages/atom-typescript).
Saving a file will then immediately compile it, so no building is needed.

Roadmap
---

Future features in no particular order:

- WFS support.
- React-based user interface.
- Split into smaller separate NPM packages.
- Optional backend.
- Configuration editing tools.

Configuration
---

Currently server addresses are defined in [index.ts](https://github.com/charto/poc-map/blob/master/src/index.ts)
until a better way is set up.

License
===

[The MIT License](https://raw.githubusercontent.com/charto/poc-map/master/LICENSE)

Copyright (c) 2015 BusFaster Ltd
