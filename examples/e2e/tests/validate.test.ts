import { describe, expect, it } from "vitest";
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);

describe("validate output", () => {
  describe("sass-example", () => {
    it("should interpret pkg: protocol correctly", () => {
      const buttonCss = require.resolve("@example/sass/css/button.css");
      const buttonCssContent = fs.readFileSync(buttonCss, "utf-8");
      expect(buttonCssContent).toMatchSnapshot();
    });

    it("should interpret relative paths and node_modules imports correctly", () => {
      const headerCss = require.resolve("@example/sass/css/header.css");
      const headerCssContent = fs.readFileSync(headerCss, "utf-8");
      expect(headerCssContent).toMatchSnapshot();
    });
  });

  describe("postcss-example", () => {
    it("should interpret pkg: protocol correctly", () => {
      const headerCss = require.resolve(
        "@example/postcss/css/button.module.css",
      );
      const headerCssContent = fs.readFileSync(headerCss, "utf-8");
      expect(headerCssContent).toMatchSnapshot();
    });

    it("should interpret relative paths and node_modules imports correctly", () => {
      const headerCss = require.resolve(
        "@example/postcss/css/header.module.css",
      );
      const headerCssContent = fs.readFileSync(headerCss, "utf-8");
      expect(headerCssContent).toMatchSnapshot();
    });
  });

  describe("postcss-cjs-example", () => {
    it("should interpret pkg: protocol correctly", () => {
      const headerCss = require.resolve(
        "@example/postcss-cjs/css/button.module.css",
      );
      const headerCssContent = fs.readFileSync(headerCss, "utf-8");
      expect(headerCssContent).toMatchSnapshot();
    });

    it("should interpret relative paths and node_modules imports correctly", () => {
      const headerCss = require.resolve(
        "@example/postcss-cjs/css/header.module.css",
      );
      const headerCssContent = fs.readFileSync(headerCss, "utf-8");
      expect(headerCssContent).toMatchSnapshot();
    });
  });
});
