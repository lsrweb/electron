import extract from "extract-zip";
// @ts-ignore
import { Extract as UnrarExtract } from "node-unrar";
// @ts-ignore
import { extractFull as extract7z } from "node-7z";
import tar from "tar";
import zlib from "zlib";
import fs from "fs";
import path from "path";

const extractFile = async (filePath: string, outputDir: string) => {
  const ext = path.extname(filePath).toLowerCase();

  switch (ext) {
    case ".zip":
      await extract(filePath, { dir: outputDir });
      break;
    case ".rar":
      const extractor = new UnrarExtract(filePath, outputDir);
      extractor.extract();
      break;
    case ".7z":
      extract7z(filePath, outputDir);
      break;
    case ".tar":
      fs.createReadStream(filePath).pipe(tar.extract({ cwd: outputDir }));
      break;
    case ".gz":
      const outputFilePath = path.join(outputDir, path.basename(filePath, ".gz"));
      fs.createReadStream(filePath).pipe(zlib.createGunzip()).pipe(fs.createWriteStream(outputFilePath));
      break;
    default:
      throw new Error(`Unsupported file type: ${ext}`);
  }
};

export default extractFile;
