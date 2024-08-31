// @ts-check
import scssPlugin from "@csstools/postcss-sass";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";
import legacyPnpImporter from "pnp-sass-importer/legacy";
import scss from "postcss-scss";
import cssModulesPlugin from "postcss-typesafe-css-modules";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default {
    syntax: scss,
    plugins: [
        scssPlugin({
            // Note this plugin is still using the LegacyImporter syntax: https://github.com/csstools/postcss-sass/blob/313816e8e9526d7cee3c3660298d89dc6510c298/src/index.mjs#L79
            importer: legacyPnpImporter(__dirname),
        }),
        cssModulesPlugin,
    ],
};
