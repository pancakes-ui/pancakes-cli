import { runShellCommand } from "../shell/run-shell";

export const getInstalledVersion = async (): Promise<{
  type: "global" | "local" | "notfound";
  version: string;
}> => {
  const localOutput = await runShellCommand("npm ls pancakes-cli");
  const match = localOutput.match(/pancakes-cli@([\d.]+)/);
  if (match) {
    const version = match[1];
    return { type: "local", version };
  }

  const globalOutput = await runShellCommand("npm ls -g pancakes-cli --json");
  const globalVersion =
    JSON.parse(globalOutput)?.dependencies?.["pancakes-cli"]?.version.trim();
  if (globalVersion) {
    return { type: "global", version: globalVersion };
  }

  return { type: "notfound", version: "0.0.0" };
};
