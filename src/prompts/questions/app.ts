import { Questions } from ".";

export const appQuestion = (): Questions => [
  {
    name: "action",
    type: "select",
    message: "select what you want to do",
    choices: [
      { title: "create new library", value: "init" },
      { title: "publish library", value: "publish" },
      { title: "exit", value: "exit" },
    ],
  },
];
