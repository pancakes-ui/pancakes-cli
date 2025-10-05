import { readFile, writeFile } from "fs/promises";

export const updatePackageJson = async (
  updates: Record<string, any>
): Promise<void> => {
  const pkgPath = "package.json";
  const raw = await readFile(pkgPath, "utf-8");
  const pkg = JSON.parse(raw);

  for (const [key, value] of Object.entries(updates)) {
    pkg[key] = value;
  }

  await writeFile(pkgPath, JSON.stringify(pkg, null, 2));
};
