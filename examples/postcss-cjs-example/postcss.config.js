const { legacyImporter } = require("pnp-sass-importer/legacy");

module.exports = {
    syntax: require("postcss-scss"),
    plugins: [
        require("@csstools/postcss-sass")({
            importer: legacyImporter(__dirname),
        }),
        require("postcss-typesafe-css-modules").default,
    ],
};
