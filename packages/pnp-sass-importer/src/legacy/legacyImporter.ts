import { LegacyImporter } from "sass";
import { createRequire } from "node:module";
import { getValidatedUrl } from "../getValidatedUrl.js";

/**
 *
 * @param dirname The directory from which to resolve the request from
 * @returns
 */
export function legacyImporter(dirname: string): LegacyImporter {
  const importer: LegacyImporter = async (url, _prev, done) => {
    const validatedUrl = getValidatedUrl(url);

    if (validatedUrl == null) {
      return null;
    }

    // If this plugin is not actually run in a PnP context (e.g. nodeLinker is set to node-modules),
    // this import statement will throw. In that scenario, we fallback to require.resolve because
    // there will be node_modules to traverse
    import("pnpapi")
      .then(({ default: pnpapi }) => {
        let res: string | null = null;
        try {
          res = pnpapi.resolveRequest(validatedUrl, dirname);
        } catch (error) {
          // It's possible the package's exports weren't set up correctly and this URL is attempting to reach into the package nonetheless
          // In that case, we can see if the URL is simply missing a .scss extension and try again
          if (!validatedUrl.endsWith(".scss")) {
            res = pnpapi.resolveRequest(validatedUrl + ".scss", dirname);
          }
        }
        if (res == null) {
          done(null);
        } else {
          done({ file: res.toString() });
        }
      })
      .catch(() => {
        console.log(
          "pnpapi not found, pnp-sass-importer is not needed outside of a PnP context. Using require.resolve instead",
        );
        const require = createRequire(dirname);
        try {
          done({
            file: require.resolve(validatedUrl, {
              paths: [dirname],
            }),
          });
        } catch (error) {
          // It's possible the package's exports weren't set up correctly and this URL is attempting to reach into the package nonetheless
          // In that case, we can see if the URL is simply missing a .scss extension and try again
          if (!validatedUrl.endsWith(".scss")) {
            done({
              file: require.resolve(validatedUrl + ".scss", {
                paths: [dirname],
              }),
            });
          }
        }
      });
  };
  return importer;
}
