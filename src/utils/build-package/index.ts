import prompts from "prompts";
import { publishBuildQuestions } from "../../prompts/questions/publish";
import { runShellCommand } from "../shell/run-shell";

export const buildPackage = async () => {
  const { runBuildNow } = await prompts(publishBuildQuestions());
  if (runBuildNow) {
    await runShellCommand("npm run build");
  } else {
    console.log(
      "⚠️ Skipping build step. Make sure the package is properly built before publishing."
    );
  }
};
