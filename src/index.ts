import actions, { createApp } from "./commands";
import { checkForUpdate } from "./utils/check-update";
import { printLogo } from "./utils/logo";

const app = async () => {
  const version = await checkForUpdate()
  printLogo(version);
  const { action } = await createApp();
  actions[action](version);
};
app();
