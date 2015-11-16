System.config({
  defaultJSExtensions: true,
  transpiler: "none",
  paths: {
    "npm/*": "node_modules/*",
    "github:*": "jspm_packages/github/*"
  },

  map: {
    "leaflet": "npm/leaflet/dist/leaflet.js",
    "leaflet.css": "npm/leaflet/dist/leaflet.css",
    "css": "github:systemjs/plugin-css@0.1.19",
    "bluebird": "npm/bluebird/js/browser/bluebird.min.js"
  }
});
