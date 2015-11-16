System.config({
  defaultJSExtensions: true,
  transpiler: "none",
  paths: {
    "npm/*": "../node_modules/*",
    "github:*": "../jspm_packages/github/*"
  },

  map: {
    "bluebird": "npm/bluebird/js/browser/bluebird.min.js",
    "css": "github:systemjs/plugin-css@0.1.19",
    "leaflet": "npm/leaflet/dist/leaflet.js",
    "leaflet.css": "npm/leaflet/dist/leaflet.css"
  }
});
