import { PosixFS } from "@yarnpkg/fslib";
import libzip, { ZipOpenFS } from "@yarnpkg/libzip";
import { Importer } from "sass";
import pnpapi from "pnpapi";
import { fileURLToPath } from "node:url";

/**
 *
 * @param dirname The directory from which to resolve the request from
 * @returns
 */
export default (dirname: string) => {
  const importer: Importer = {
    canonicalize: (url, _context) => {
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
