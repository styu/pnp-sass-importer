import { PosixFS } from "@yarnpkg/fslib";
import libzip, { ZipOpenFS } from "@yarnpkg/libzip";
import { Importer } from "sass";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

/**
 *
 * @param dirname The directory from which to resolve the request from
 * @returns
 */
export default (dirname: string) => {
    const importer: Importer = {
        canonicalize: async (url, _context) => {
            let pnpapi;
            try {
                // If this plugin is not actually run in a PnP context (e.g. nodeLinker is set to node-modules),
                // this import statement will throw. In that scenario, we fallback to require.resolve because
                // there will be node_modules to traverse
                pnpapi = await import("pnpapi");
            } catch (error) {
                console.log(
                    "pnpapi not found, pnp-sass-importer is not needed outside of a PnP context. Using require.resolve instead",
                );

                const require = createRequire(dirname);
                let res: string | null = null;
                try {
                    res = require.resolve(url, {
                        paths: [dirname],
                    });
                } catch (error) {
                    if (!url.endsWith(".scss")) {
                        res = require.resolve(url + ".scss", {
                            paths: [dirname],
                        });
                    }
                }
                if (res == null) {
                    return null;
                }
                return new URL(`file:///${res}`);
            }
            let res: string | null = null;
            try {
                res = pnpapi.resolveRequest(url, dirname);
            } catch (error) {
                // It's possible the package's exports weren't set up correctly and this URL is attempting to reach into the package nonetheless
                // In that case, we can see if the URL is simply missing a .scss extension and try again
                if (!url.toString().endsWith(".scss")) {
                    res = pnpapi.resolveRequest(url + ".scss", dirname);
                }
            }
            if (res == null) {
                return null;
            }
            return new URL(`file:///${res}`);
        },
        load: (url: URL) => {
            const zipOpenFs = new ZipOpenFS({ libzip: libzip.getLibzipSync() });
            const crossFs = new PosixFS(zipOpenFs);
            const file = crossFs.readFileSync(fileURLToPath(url.toString()));
            const syntax = url.toString().endsWith(".css") ? "css" : "scss";
            return { contents: file.toString(), syntax };
        },
    };
    return importer;
};
