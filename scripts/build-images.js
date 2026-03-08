#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const rootDir = path.join(__dirname, "..");
const sourceDir = path.join(rootDir, "assets", "albums");
const outputDir = path.join(rootDir, "assets", "generated", "albums");

const responsiveWidths = [320, 480, 720];
const photoQuality = {
  avif: 48,
  webp: 68,
};

async function ensureDirectory(dirPath) {
  await fs.promises.mkdir(dirPath, { recursive: true });
}

async function removeStaleFiles(dirPath, expectedFiles) {
  const existingFiles = await fs.promises.readdir(dirPath);
  const staleFiles = existingFiles.filter((fileName) => !expectedFiles.has(fileName));

  await Promise.all(
    staleFiles.map((fileName) => fs.promises.unlink(path.join(dirPath, fileName))),
  );
}

async function getPhotoSources() {
  const fileNames = await fs.promises.readdir(sourceDir);
  return fileNames
    .filter((fileName) => fileName.endsWith("_PHOTO.webp"))
    .sort();
}

async function buildPhotoVariants(fileName, expectedFiles) {
  const inputPath = path.join(sourceDir, fileName);
  const baseName = path.parse(fileName).name;
  const metadata = await sharp(inputPath).metadata();

  if (!metadata.width || !metadata.height) {
    throw new Error(`Missing dimensions for ${fileName}`);
  }

  const targetWidths = responsiveWidths.filter((width) => width <= metadata.width);
  if (targetWidths.length === 0) {
    targetWidths.push(metadata.width);
  }

  await Promise.all(
    targetWidths.flatMap((width) => {
      const resizedImage = sharp(inputPath).resize({
        width,
        fit: "inside",
        withoutEnlargement: true,
      });

      const avifName = `${baseName}-${width}w.avif`;
      const webpName = `${baseName}-${width}w.webp`;

      expectedFiles.add(avifName);
      expectedFiles.add(webpName);

      return [
        resizedImage
          .clone()
          .avif({ quality: photoQuality.avif })
          .toFile(path.join(outputDir, avifName)),
        resizedImage
          .clone()
          .webp({ quality: photoQuality.webp })
          .toFile(path.join(outputDir, webpName)),
      ];
    }),
  );
}

async function main() {
  await ensureDirectory(outputDir);

  const expectedFiles = new Set();
  const photoSources = await getPhotoSources();

  if (photoSources.length === 0) {
    throw new Error("No *_PHOTO.webp files found in assets/albums");
  }

  for (const fileName of photoSources) {
    await buildPhotoVariants(fileName, expectedFiles);
  }

  await removeStaleFiles(outputDir, expectedFiles);

  console.log(`Generated ${expectedFiles.size} responsive image files in assets/generated/albums`);
}

main().catch((error) => {
  console.error(`ERROR: ${error.message}`);
  process.exit(1);
});
