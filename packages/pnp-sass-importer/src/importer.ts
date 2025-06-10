import { PosixFS } from "@yarnpkg/fslib";
import libzip, { ZipOpenFS } from "@yarnpkg/libzip";
import { Importer } from "sass";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { getValidatedUrl } from "./getValidatedUrl.js";

/**
 *
 * @param dirname The directory from which to resolve the request from
 * @returns
 */
export function createImporter(dirname: string): Importer {
  const importer: Importer = {
    canonicalize: async (url, _context) => {
      const validatedUrl = getValidatedUrl(url);

      if (validatedUrl == null) {
        return null;
      }

      let pnpapi;
      try {
        // If this plugin is not actually run in a PnP context (e.g. nodeLinker is set to node-modules),
        // this import statement will throw. In that scenario, we fallback to require.resolve because
        // there will be node_modules to traverse
        pnpapi = (await import("pnpapi")).default;
      } catch (error) {
        console.log(
          "pnpapi not found, pnp-sass-importer is not needed outside of a PnP context. Using require.resolve instead",
        );

        const require = createRequire(dirname);
        let res: string | null = null;
        try {
          res = require.resolve(validatedUrl, {
            paths: [dirname],
          });
        } catch (error) {
          if (!validatedUrl.endsWith(".scss")) {
            res = require.resolve(validatedUrl + ".scss", {
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
        res = pnpapi.resolveRequest(validatedUrl, dirname);
      } catch (error) {
        // It's possible the package's exports weren't set up correctly and this URL is attempting to reach into the package nonetheless
        // In that case, we can see if the URL is simply missing a .scss extension and try again
        if (!url.toString().endsWith(".scss")) {
          res = pnpapi.resolveRequest(validatedUrl + ".scss", dirname);
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
}
