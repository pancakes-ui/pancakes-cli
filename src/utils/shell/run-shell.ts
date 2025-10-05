import { exec } from "child_process";

export const runShellCommand = (command: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout) => {
      if (err && !stdout) return reject(err);
      return resolve(stdout.trim());
    });
  });
};
