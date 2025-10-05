import { updatePackageJson } from "./update-package-json";
import { runShellCommand } from "../shell/run-shell";
import { dirname } from "path";
import { mkdir, writeFile } from "fs/promises";
import { buildCommands, BuildCommands } from "../../static/build";

export const initNpmProject = async (
  author: string,
  mainfile: string,
  commitizen: boolean,
  testname: string,
  buildname: keyof BuildCommands
): Promise<void> => {
  await runShellCommand("npm init -y");
  await updatePackageJson({
    author,
    main: mainfile,
    type: "module",
    "pancakes-cli": true,
    scripts: {
      start: `node --import=tsx ${mainfile}`,
      test: testname,
      build: buildCommands[buildname](mainfile),
      ...(commitizen ? { commit: "cz" } : {}),
    },
    ...(commitizen
      ? {
          config: {
            commitizen: { path: "./node_modules/cz-conventional-changelog" },
          },
        }
      : {}),
  });

  await createMainFile(mainfile);
};

const createMainFile = async (mainfile: string) => {
  const dir = dirname(mainfile);
  await mkdir(dir, { recursive: true });
  await writeFile(mainfile, `console.log("hello by pancakes-cli");\n`, {
    flag: "wx",
  });
};
