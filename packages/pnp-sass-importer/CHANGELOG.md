# pnp-sass-importer

## 2.0.0

### Major Changes

- 2223e9d:
  - Drop named export `legacyImporter` from `./legacy` path, and only export a default export
  - Support `pkg:` protocol, per https://sass-lang.com/documentation/at-rules/use/#pkg-ur-ls
  - Only support Node >=22

### Patch Changes

- ce763ce: Change sass dependency to `^`, bump `@yarnpkg/fslib` to `^3.1.2` and `@yarnpkg/libzip` to `^3.2.1`

## 1.0.0

### Major Changes

- d039176: Fall back to `require.resolve` if `pnpapi` is not available

## 0.2.1

### Patch Changes

- 2264a1e: Add license field to package.json

## 0.2.0

### Minor Changes

- 18280ba: Fix commonjs/esm outputs

## 0.1.0

### Minor Changes

- Initial release
