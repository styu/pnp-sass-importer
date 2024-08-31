#!/usr/bin/env node

// @ts-check
import fs from "fs-extra";
import { basename, dirname, extname, join, parse as parsePath } from "node:path";
import * as sass from "sass";
import pnpImporter from "pnp-sass-importer";
import { fileURLToPath } from "node:url";

const inputFolder = process.argv[2];
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const outputFolder = join(__dirname, "build/css");

if (inputFolder == null) {
    throw new Error("Please provide an input folder to compile");
}

await compileAllFiles();

async function compileAllFiles() {
    const files = fs.readdirSync(inputFolder);
    const inputFilePaths = files
        .filter(file => extname(file) === ".scss" && !basename(file).startsWith("_"))
        .map(fileName => join(inputFolder, fileName));

    await Promise.all(inputFilePaths.map(compileFile));
    console.info("[sass-compile] Finished compiling all input .scss files.");
}

async function compileFile(inputFilePath) {
    fs.mkdirpSync(outputFolder);
    const outputFilePath = join(outputFolder, `${parsePath(inputFilePath).name}.css`);
    const result = await sass.compileAsync(inputFilePath, {
        importers: [pnpImporter(__dirname)],
        charset: true,
    });
    fs.outputFileSync(outputFilePath, result.css, { flag: "w" });
}
