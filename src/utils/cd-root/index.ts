import { chdir, cwd } from "process";

const originalDir = cwd();

export const cdRoot = () => {
  chdir(originalDir);
};
