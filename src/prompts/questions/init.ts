import { Questions } from ".";
import { execSync } from "child_process";
import { createOption } from "../../utils/prompts/create-option";

export const initQuestions = (author: string): Questions => [
  {
    type: "text",
    message: "enter app name:",
    initial: "my-pancakes",
    name: "appname",
    validate: async (input: string) => {
      if (!input || input.trim().length === 0) {
        return "Project name cannot be empty.";
      }
      if (input !== input.toLowerCase()) {
        return "Project name must be lowercase.";
      }
      if (!/^[a-z0-9\-]+$/.test(input)) {
        return "Project name can only contain lowercase letters, numbers, and hyphens.";
      }
      try {
        execSync(`npm view ${input} version`, { stdio: "ignore" });
        return `Package name "${input}" is already taken on npm. Please choose another name.`;
      } catch {
        return true;
      }
    },
  },
  {
    type: "text",
    message: "enter author name:",
    initial: author,
    name: "author",
  },
  {
    type: "text",
    message: "enter main file name:",
    initial: "index.ts",
    name: "mainfile",
  },
  {
    type: "select",
    message: "choose build tool:",
    name: "buildname",
    choices: [
      createOption("tsup"),
      createOption("rollup"),
      createOption("esbuild"),
    ],
  },
  {
    type: "select",
    message: "choose test tool:",
    name: "testname",
    choices: [createOption("vitest")],
  },
  {
    type: "confirm",
    initial: true,
    message: "need commitizen?",
    name: "commitizen",
  },
];
