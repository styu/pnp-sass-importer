import { describe, expect, it } from "vitest";
import { getValidatedUrl } from "./getValidatedUrl.js";

describe("getValidatedUrl", () => {
  describe("pkg: URLs", () => {
    it("should throw an error if the url is not a valid pkg: URL", () => {
      expect(() => getValidatedUrl("pkg:http://example.com")).toThrow();
      expect(() => getValidatedUrl("pkg:http://username:password@example.com")).toThrow();
      expect(() => getValidatedUrl("pkg:")).toThrow();
      expect(() => getValidatedUrl("pkg:/something")).toThrow();
    });

    it("should return null for relative paths", () => {
      expect(getValidatedUrl("pkg:./something")).toBeNull();
      expect(getValidatedUrl("pkg:./something.css")).toBeNull();
      expect(getValidatedUrl("pkg:../something")).toBeNull();
      expect(getValidatedUrl("pkg:./something/else.scss")).toBeNull();
      expect(getValidatedUrl("pkg:../something/else.scss")).toBeNull();
      expect(getValidatedUrl("pkg:./something/else/index.scss")).toBeNull();
      expect(getValidatedUrl("pkg:../something/else/index.scss")).toBeNull();
      expect(getValidatedUrl("pkg:./something/else/index.scss")).toBeNull();
      expect(getValidatedUrl("pkg:@org/pkg\\something")).toBeNull();
      expect(getValidatedUrl("pkg:@org/pkg%something")).toBeNull();
      expect(getValidatedUrl("pkg:@org")).toBeNull();
    });

    it("should return the package path", () => {
      expect(getValidatedUrl("pkg:@org/pkg")).toBe("@org/pkg");
      expect(getValidatedUrl("pkg:@org/pkg/index.scss")).toBe("@org/pkg/index.scss");
      expect(getValidatedUrl("pkg:@org/pkg/subpath")).toBe("@org/pkg/subpath");
      expect(getValidatedUrl("pkg:@org/pkg/index.css")).toBe("@org/pkg/index.css");
      expect(getValidatedUrl("pkg:package-name")).toBe("package-name");
      expect(getValidatedUrl("pkg:package-name/index.scss")).toBe("package-name/index.scss");
      expect(getValidatedUrl("pkg:package-name/index.css")).toBe("package-name/index.css");
    });
  });
});
