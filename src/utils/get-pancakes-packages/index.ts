import { existsSync } from "fs";
import { readdir, readFile } from "fs/promises";
import path from "path";

export const getPancakesPackages = async () => {
  const rootDir = process.cwd();
  const packages: { name: string; version: string; path: string }[] = [];

  const currentPkgJsonPath = path.join(rootDir, "package.json");
  if (existsSync(currentPkgJsonPath)) {
    const currentPkgJson = JSON.parse(
      await readFile(currentPkgJsonPath, "utf-8")
    );
    if (currentPkgJson["pancakes-cli"]) {
      packages.push({
        name: currentPkgJson.name || path.basename(rootDir),
        version: currentPkgJson.version || "0.0.0",
        path: rootDir,
      });
    }
  }

  const dirs = (await readdir(rootDir, { withFileTypes: true })).filter(
    (item) => item.isDirectory()
  );

  const globalPackagesRaw = await Promise.all(
    dirs.map(async (dirent) => {
      const pkgPath = path.join(rootDir, dirent.name);
      if (pkgPath === rootDir) return null;

      const pkgJsonPath = path.join(pkgPath, "package.json");
      if (existsSync(pkgJsonPath)) {
        const pkgJson = JSON.parse(await readFile(pkgJsonPath, "utf-8"));
        if (pkgJson["pancakes-cli"]) {
          return {
            name: pkgJson.name || dirent.name,
            version: pkgJson.version || "0.0.0",
            path: pkgPath,
          };
        }
      }
      return null;
    })
  );

  const globalPackages = globalPackagesRaw.filter(Boolean) as typeof packages;

  return [...packages, ...globalPackages];
};
