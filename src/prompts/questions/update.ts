import { Questions } from ".";

export const updateQuestion = (version: string): Questions => [
  {
    name: "update",
    type: "confirm",
    message: `⚠️  A newer version of pancakes-cli is available (v${version}). Do you want to update now?`,
    initial: true,
  },
];
