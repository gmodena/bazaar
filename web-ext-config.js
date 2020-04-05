const defaultConfig = {
    // Global options:
    sourceDir: "extension",
    artifactsDir: "extension-dist",
    ignoreFiles: [".DS_Store", "./test"],
    // Command options:
    build: {
        overwriteDest: true,
    },
    run: {
        browserConsole: false,
        startUrl: ["about:debugging"],
    },
};

module.exports = defaultConfig;