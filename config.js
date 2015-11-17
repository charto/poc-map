System.config({
  baseURL: "/",
  defaultJSExtensions: true,
  transpiler: "none",
  paths: {
    "npm/*": "node_modules/*",
    "github:*": "jspm_packages/github/*"
  },

  meta: {
    "clean-css": {
      "loader": "charto/plugin-node"
    }
  },

  map: {
    "bluebird": "npm/bluebird/js/browser/bluebird.min.js",
    "charto/plugin-node": "github:charto/plugin-node@master",
    "clean-css": "npm/clean-css/index.js",
    "css": "github:systemjs/plugin-css@0.1.19",
    "leaflet": "npm/leaflet/dist/leaflet.js",
    "leaflet.css": "npm/leaflet/dist/leaflet.css"
  }
});
