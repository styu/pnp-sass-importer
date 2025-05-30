module.exports = {
  printWidth: 120,
  tabWidth: 2,
  trailingComma: "all",
  arrowParens: "avoid",
  overrides: [
    {
      files: ["*.scss", "*.css", "*.json", "*.yml", "*.swcrc"],
      options: {
        tabWidth: 2,
      },
    },
  ],
};
