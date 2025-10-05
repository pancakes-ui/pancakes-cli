import { runShellCommand } from "../shell/run-shell";

export const installPackages = async (
  commitizen: boolean,
  ...packagesName: string[]
): Promise<string> => {
  const allPackages = [
    ...packagesName,
    "typescript",
    "tsx",
    ...(commitizen ? ["commitizen", "cz-conventional-changelog"] : [""]),
  ];
  await runShellCommand("npm install -D typescript");
  return runShellCommand(`npm install ${allPackages.join(" ")} --save-dev`);
};
