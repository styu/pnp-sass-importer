# pnp-sass-importer

This is a Sass [importer](https://sass-lang.com/documentation/js-api/interfaces/importer/) for Yarn PnP projects that want to resolve `@import` or `@use` statements from packages external to the current one.

For example, if you have a Yarn PnP monorepo that has packages `foo-lib` and `bar-lib`, and `foo-lib` depends on `bar-lib`, then the following will work:

```scss
// In-repo dependency
@use "bar-lib/scss/variables.scss" as bar;
// Out-of-repo dependency
@use "@blueprintjs/core/lib/scss/variables.scss" as bp;

.my-class {
  color: bar.$main-color;
  font-family: bp.$pt-font-family;
}
```

At the time of writing, Sass does not natively support module resolution in a Yarn PnP context, and assumes the existence of `node_modules` for lookup. Unfortunately this does not work if you have zero installs enabled, so I wrote this little package hoping it could help others as well.

For working examples, see the `examples` folder in the repo.

## Usage

### Sass Javascript API

[Sass importers](https://sass-lang.com/documentation/js-api/interfaces/importer/) must be passed in via the Sass Javascript API:

```js
// ESM
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import pnpImporter from "pnp-sass-importer";
import * as sass from "sass";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

sass.compileAsync("hello.scss", {
  // Requires the directory of the package you are compiling for PnP to do lookups from
  importers: [pnpImporter(__dirname)],
});
```

Alternatively, in CommonJS:

```js
// CommonJS
const pnpImporter = require("pnp-sass-importer");
const sass = require("sass");

sass.compileAsync("hello.scss", {
  // Requires the directory of the package you are compiling for PnP to do lookups from
  importers: [pnpImporter(__dirname)],
});
```

### PostCSS

You can use this importer together with the [PostCSS Sass](https://github.com/csstools/postcss-sass) plugin as well. Note that at the time of writing (August 31, 2024), this plugin still uses the [LegacyImporter](https://sass-lang.com/documentation/js-api/types/legacyimporter/) syntax, which this package also supports:

```js
// postcss.config.mjs
import scssPlugin from "@csstools/postcss-sass";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import legacyPnpImporter from "pnp-sass-importer/legacy";
import scss from "postcss-scss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
  syntax: scss,
  plugins: [
    scssPlugin({
      importer: legacyPnpImporter(__dirname),
    }),
  ],
};
```

Alternatively, in CommonJS:

```js
// postcss.config.js
const legacyPnpImporter = require("pnp-sass-importer/legacy");

export default {
  syntax: require("postcss-scss"),
  plugins: [
    require("@csstools/postcss-sass")({
      importer: legacyPnpImporter(__dirname),
    }),
  ],
};
```
