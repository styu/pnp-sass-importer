module.exports = {
    printWidth: 120,
    tabWidth: 4,
    trailingComma: "all",
    arrowParens: "avoid",
    overrides: [
        {
            files: ["*.scss", "*.css", "*.json", "*.yml"],
            options: {
                tabWidth: 2,
            },
        },
    ],
};
