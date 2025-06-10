import path from "path";

const SASS_PKG_PREFIX = "pkg:";

class PkgUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "PkgUrlError";
  }
}

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
      throw new PkgUrlError(`A pkg: URL's path must not begin with /`);
    }

    if (urlToUse.trim() === "") {
      throw new PkgUrlError("A pkg: URL must not be empty");
    }

    try {
      const validatedUrl = new URL(urlToUse);
      // Throw specific error messages per https://sass-lang.com/documentation/at-rules/use/#rules-for-a-pkg-importer
      if (
        validatedUrl.username !== "" ||
        validatedUrl.password !== "" ||
        validatedUrl.host !== "" ||
        validatedUrl.port !== "" ||
        validatedUrl.search !== "" ||
        validatedUrl.hash !== ""
      ) {
        throw new PkgUrlError("A pkg: URL must not have a host, port, username or password.");
      }
      if (validatedUrl.search !== "" || validatedUrl.hash !== "") {
        throw new PkgUrlError("A pkg: URL must not have a query or fragment.");
      }
      throw new PkgUrlError("A pkg: URL must begin with a package name");
    } catch (error) {
      if (error instanceof PkgUrlError) {
        throw error;
      }
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
