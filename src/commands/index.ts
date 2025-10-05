import prompts from "prompts";
import { init } from "./init";
import { publish } from "./publish";
import { appQuestion } from "../prompts/questions/app";
import { cdRoot } from "../utils/cd-root";
import { printLogo } from "../utils/logo";

type Actions = { init: Function; publish: Function; exit: Function };
type Action = { action: keyof Actions };

export const createApp = async (): Promise<Action> => {
  return (await prompts(appQuestion())) as Action;
};
const actions: Actions = {
  init: async (version: string) => {
    cdRoot();
    printLogo(version);
    await init();
    const { action } = await createApp();
    actions[action]();
  },
  publish: async (version: string) => {
    cdRoot();
    printLogo(version);
    await publish();
    const { action } = await createApp();
    actions[action]();
  },
  exit: async () => {
    console.log("sybau :)");
    process.exit(0);
  },
};
export default actions;
