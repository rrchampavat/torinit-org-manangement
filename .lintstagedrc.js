module.exports = {
  // Type check TypeScript files
  // "**/*.(ts|tsx)": () => "yarn tsc --noEmit",

  // Lint & Prettify TS and JS files
  "**/*.(ts|tsx|js)": (filenames) => [
    `npx prettier --check ${filenames.join(" ")}`,
    `npx eslint ${filenames.join(" ")} --ext ts --ext tsx --ext js --ext jsx`
  ],

  // Prettify only Markdown and JSON files
  "**/*.(md|json)": (filenames) => `npx prettier --write ${filenames.join(" ")}`
};
