/* eslint-env node */

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    // "eslint:recommended",
    // "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/recommended",
    // "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
    // "./.eslintrc-auto-import.json",
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  parser: "@typescript-eslint/parser",
  rules: {},
};
