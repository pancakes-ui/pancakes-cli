import { existsSync } from "fs";
import path from "path";
import { runShellCommand } from "../shell/run-shell";

export const installDeps = async (projectPath: string) => {
  const nodeModulesPath = path.join(projectPath, "node_modules");
  if (existsSync(nodeModulesPath)) {
    await runShellCommand("npm install");
  }
};
