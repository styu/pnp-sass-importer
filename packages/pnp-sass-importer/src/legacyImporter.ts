import { LegacyImporter } from "sass";
import { createRequire } from "node:module";

/**
 *
 * @param dirname The directory from which to resolve the request from
 * @returns
 */
export function legacyImporter(dirname: string) {
    const importer: LegacyImporter = async (url, _prev, done) => {
        // If this plugin is not actually run in a PnP context (e.g. nodeLinker is set to node-modules),
        // this import statement will throw. In that scenario, we fallback to require.resolve because
        // there will be node_modules to traverse
        import("pnpapi")
            .then(({ default: pnpapi }) => {
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
            })
            .catch(() => {
                console.log(
                    "pnpapi not found, pnp-sass-importer is not needed outside of a PnP context. Using require.resolve instead",
                );
                const require = createRequire(dirname);
                try {
                    done({
                        file: require.resolve(url, {
                            paths: [dirname],
                        }),
                    });
                } catch (error) {
                    // It's possible the package's exports weren't set up correctly and this URL is attempting to reach into the package nonetheless
                    // In that case, we can see if the URL is simply missing a .scss extension and try again
                    if (!url.endsWith(".scss")) {
                        done({
                            file: require.resolve(url + ".scss", {
                                paths: [dirname],
                            }),
                        });
                    }
                }
            });
    };
    return importer;
}
export default legacyImporter;
