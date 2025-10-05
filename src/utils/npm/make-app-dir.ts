import { mkdir } from "fs";
import { chdir, cwd } from "process";
import { resolve } from "path";

export const makeAppDir = (appname: string): Promise<string> => {
  return new Promise((resolvePath, reject) => {
    const folderPath = resolve(cwd(), appname);
    console.log(folderPath);
    mkdir(folderPath, { recursive: true }, (err) => {
      if (err) return reject(err);
      chdir(folderPath);
      resolvePath(folderPath);
    });
  });
};
