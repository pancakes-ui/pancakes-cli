import { Questions } from ".";

export const publishQuestions = (
  packages: { name: string; version: string; path: string }[]
): Questions => [
  {
    type: "select",
    name: "selectedPackage",
    message: "Select a package to publish:",
    choices: packages.map((pkg) => ({
      title: `${pkg.name} (v${pkg.version})`,
      value: pkg,
    })),
  },
];

export const publishVersionQuestions = (currentVersion: string): Questions => [
  {
    type: "text",
    name: "newVersion",
    message: "Enter the version you want to publish:",
    initial: currentVersion,
    validate: (input: string) => {
      const regex = /^v?(\d+)\.(\d+)\.(\d+)$/;
      const match = input.match(regex);

      if (!match) {
        return "Please enter a valid semver version (e.g., v1.2.3 or 1.2.3).";
      }

      const [, major, minor, patch] = match.map(Number);
      const [curMajor, curMinor, curPatch] = currentVersion
        .replace(/^v/, "")
        .split(".")
        .map(Number);

      const isGreater =
        major > curMajor ||
        (major === curMajor && minor > curMinor) ||
        (major === curMajor && minor === curMinor && patch > curPatch);

      if (!isGreater) {
        return `Version must be greater than the current version (${currentVersion}).`;
      }

      return true;
    },
  },
];

export const publishBuildQuestions = (): Questions => [
  {
    type: "confirm",
    name: "runBuildNow",
    message: "Do you want to run `npm run build` build now before publishing?",
    initial: true,
  },
];

export const publishConfirmQuestions = (
  pkg: { name: string },
  newVersion: string
): Questions => [
  {
    type: "confirm",
    name: "confirmPublish",
    message: `Are you sure you want to publish '${pkg.name}@${newVersion}' to npm?`,
    initial: false,
  },
];
