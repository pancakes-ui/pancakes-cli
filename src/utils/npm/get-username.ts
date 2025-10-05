import { exec } from "child_process";

export const getUsername = (): Promise<string> => {
  return new Promise((resolve) => {
    exec("npm whoami", (err, stdout) => {
      if (err) return resolve("");
      resolve(stdout.trim());
    });
  });
};
