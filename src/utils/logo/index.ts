export const printLogo = (message?: string) => {
  console.clear();
  console.log(`\x1b[93m░█▀█░█▀█░█▀█░█▀▀░█▀█░█░█░█▀▀░█▀▀░░░░░█▀▀░█░░░▀█▀
░█▀▀░█▀█░█░█░█░░░█▀█░█▀▄░█▀▀░▀▀█░▄▄▄░█░░░█░░░░█░
░▀░░░▀░▀░▀░▀░▀▀▀░▀░▀░▀░▀░▀▀▀░▀▀▀░░░░░▀▀▀░▀▀▀░▀▀▀\x1b[0m\n`);
  console.log(message || "");
};
