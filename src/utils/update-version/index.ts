import prompts from "prompts";
import { readFile, writeFile } from "fs/promises";
import path from "path";
import { publishVersionQuestions } from "../../prompts/questions/publish";

export const updateVersion = async (pkgPath: string) => {
  const packageJsonPath = path.join(pkgPath, "package.json");
  const packageJson = JSON.parse(await readFile(packageJsonPath, "utf-8"));
  const currentVersion = packageJson.version || "0.0.0";

  console.log(`Current version of ${packageJson.name} is: ${currentVersion}`);
  const { newVersion } = await prompts(publishVersionQuestions(currentVersion));

  if (!newVersion) return null;

  packageJson.version = newVersion;
  await writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2));
  return newVersion;
};
