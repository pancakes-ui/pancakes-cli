import { writeFile } from "fs/promises";
import { buildCodes, BuildCodes } from "../../static/build";

export const initBuild = async (buildname: keyof BuildCodes): Promise<void> => {
  const configPath = `${buildname}.config.ts`;

  await writeFile(configPath, buildCodes[buildname], { flag: "wx" });

  console.log(`🔧 ${buildname} initialized with config at ${configPath}`);
};
