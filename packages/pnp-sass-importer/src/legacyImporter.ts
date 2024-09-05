import { LegacyImporter } from "sass";

/**
 *
 * @param dirname The directory from which to resolve the request from
 * @returns
 */
export function legacyImporter(dirname: string) {
    const importer: LegacyImporter = async (url, _prev, done) => {
        let pnpApiPromise;
        try {
            // If this plugin is not actually run in a PnP context (e.g. nodeLinker is set to node-modules),
            // this import statement will throw. In that scenario, this importer is actually not necessary
            // because Sass's --pkg-importer functionality will have node_modules to traverse
            pnpApiPromise = import("pnpapi");
        } catch (error) {
            console.log("pnpapi not found, pnp-sass-importer is not needed outside of a PnP context. Returning null");
            done(null);
            return;
        }
        pnpApiPromise.then(pnpapi => {
            let res: string | null = null;
            try {
                res = pnpapi.resolveRequest(url, dirname);
            } catch (error) {
                // It's possible the package's exports weren't set up correctly and this URL is attempting to reach into the package nonetheless
                // In that case, we can see if the URL is simply missing a .scss extension and try again
                if (!url.endsWith(".scss")) {
                    res = pnpapi.resolveRequest(url + ".scss", dirname);
                }
            }
            if (res == null) {
                done(null);
            } else {
                done({ file: res.toString() });
            }
        });
    };
    return importer;
}
export default legacyImporter;
