import { runShellCommand } from "../shell/run-shell";

export const initTsConfig = async () => {
  await runShellCommand("npx tsc --init");
};
