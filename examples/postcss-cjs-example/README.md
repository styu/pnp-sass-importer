# postcss-example

This example compiles sass via postcss (using the [`@csstools/postcss-sass](https://github.com/csstools/postcss-sass) plugin). Doing so requires using the legacy `importer` option in the sass compiler due to how `@csstools/postcss-sass` forwards along dart-sass options.

In this example, `hello.module.scss` imports variables from both an in-repo package (`@example/theme`) and a third party package (`@blueprintjs/core`).
