import prompts from "prompts";
import { initQuestions } from "../prompts/questions/init";
import { initNpmProject } from "../utils/npm";
import { getUsername } from "../utils/npm/get-username";
import { initBuild } from "../utils/npm/init-build";
import { initTsConfig } from "../utils/npm/init-tsconfig";
import { installPackages } from "../utils/npm/install-packages";
import { makeAppDir } from "../utils/npm/make-app-dir";

export const init = async () => {
  const username = await getUsername();
  const { appname, author, mainfile, buildname, testname, commitizen } =
    await prompts(initQuestions(username));

  const folderPath = await makeAppDir(appname);
  console.log("📁 Created and entered:", folderPath);

  await initNpmProject(author, mainfile, commitizen, testname, buildname);
  await installPackages(commitizen, buildname, testname);
  await initBuild(buildname);
  await initTsConfig();

  console.log("📦 npm project initialized with author:", author);
};
