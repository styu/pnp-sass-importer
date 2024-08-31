import { LegacyImporter } from "sass";
import pnpapi from "pnpapi";

/**
 *
 * @param dirname The directory from which to resolve the request from
 * @returns
 */
export default (dirname: string) => {
  const importer: LegacyImporter = (url, _prev, done) => {
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
  };
  return importer;
};
