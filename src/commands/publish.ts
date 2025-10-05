import { chdir } from "process";
import { buildPackage } from "../utils/build-package";
import { installDeps } from "../utils/install-deps";
import { confirmAndPublish } from "../utils/publish";
import { selectPackage } from "../utils/select-pacakges";
import { updateVersion } from "../utils/update-version";

export const publish = async () => {
  const selectedPackage = await selectPackage();
  if (!selectedPackage) return;

  chdir(selectedPackage.path);

  const newVersion = await updateVersion(selectedPackage.path);
  if (!newVersion) return;

  await installDeps(selectedPackage.path);
  await buildPackage();
  await confirmAndPublish(selectedPackage, newVersion);
};
