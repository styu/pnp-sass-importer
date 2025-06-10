import path from "path";

const SASS_PKG_PREFIX = "pkg:";

/**
 * @param url The URL to get the file path for
 * @returns The file path for the URL, or null if the URL is not a valid pkg: URL
 */
export function getValidatedUrl(url: string) {
  let urlToUse = url;

  if (url.startsWith(SASS_PKG_PREFIX)) {
    urlToUse = url.slice(SASS_PKG_PREFIX.length);
    /**
     * Validation based on: https://sass-lang.com/documentation/at-rules/use/#rules-for-a-pkg-importer
     * pkg: importers must reject the following patterns:
     * - A URL whose path begins with /.
     * - A URL with non-empty/null username, password, host, port, query, or fragment.
     */
    if (urlToUse.startsWith("/")) {
      throw new Error(`A pkg: URL's path must not begin with /`);
    }

    try {
      const url = new URL(urlToUse);
      // Throw specific error messages
      if (
        url.username !== "" ||
        url.password !== "" ||
        url.host !== "" ||
        url.port !== "" ||
        url.search !== "" ||
        url.hash !== ""
      ) {
        throw new Error("A pkg: URL must not have a host, port, username or password.");
      }
      if (url.search !== "" || url.hash !== "") {
        throw new Error("A pkg: URL must not have a query or fragment.");
      }
      throw new Error("A pkg: URL must begin with a package name");
    } catch {
      // A valid pkg: reference should actually throw when called with new URL
    }
  }

  // If the package name is not a valid Node package name, return null in case
  // another importer can handle.
  if (
    urlToUse.startsWith(".") ||
    urlToUse.includes("\\") ||
    urlToUse.includes("%") ||
    (urlToUse.startsWith("@") && !urlToUse.includes(path.sep))
  ) {
    return null;
  }

  return urlToUse;
}
