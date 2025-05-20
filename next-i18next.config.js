// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require("path");

module.exports = {
  i18n: {
    defaultLocale: "ro",
    locales: ["ro", "en"],
  },
  localePath: path.resolve("./public/locales"),
};
