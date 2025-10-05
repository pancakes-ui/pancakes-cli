import prompts from "prompts";
import { publishConfirmQuestions } from "../../prompts/questions/publish";
import { runShellCommand } from "../shell/run-shell";

export const confirmAndPublish = async (pkg: any, version: string) => {
  const { confirmPublish } = await prompts(
    publishConfirmQuestions(pkg, version)
  );
  if (!confirmPublish) {
    console.log("Publish cancelled.");
    return;
  }

  try {
    await runShellCommand("npm publish --access public");
    console.log("✅ Package published to npm successfully!");
  } catch (err) {
    console.error("❌ Publish failed:", err);
    throw err;
  }
};
