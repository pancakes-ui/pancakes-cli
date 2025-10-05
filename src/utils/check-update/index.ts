import prompts from "prompts";
import { updateQuestion } from "../../prompts/questions/update";
import { getInstalledVersion } from "../get-installed-version";
import { runShellCommand } from "../shell/run-shell";

export const checkForUpdate = async () => {
  const { version, type } = await getInstalledVersion();
  const npmVersion = await runShellCommand("npm view pancakes-cli version");
  if (version != npmVersion) {
    const { update } = await prompts(updateQuestion(npmVersion));

    if (!update) {
      console.log("Sybau...");
      process.exit(0);
    }

    process.stdout.write("Updating to the latest version... Please wait.\n");
    const installCommands = () => {
      const isUnix = process.platform != "win32";
      if (type !== "local") {
        if (isUnix) {
          return "sudo npm install -g pancakes-cli@latest";
        }
        return "npm install -g pancakes-cli@latest";
      }
      return "npm install pancakes-cli@latest";
    };
    await runShellCommand(installCommands());
    return `successfully updated to latest version (v${npmVersion})`;
  }
  return `latest version installed (v${npmVersion})`;
};
