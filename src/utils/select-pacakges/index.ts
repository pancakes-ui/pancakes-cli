import prompts from "prompts";
import { publishQuestions } from "../../prompts/questions/publish";
import { getPancakesPackages } from "../get-pancakes-packages";

export const selectPackage = async () => {
  const packages = await getPancakesPackages();

  if (!packages.length) {
    console.error(
      "❌ No pancakes-cli packages found in the current directory."
    );
    return null;
  }

  const { selectedPackage } = await prompts(publishQuestions(packages));
  return selectedPackage?.name ? selectedPackage : null;
};
