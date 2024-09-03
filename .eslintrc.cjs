/* eslint-env node */
// require("@rushstack/eslint-patch/modern-module-resolution");

module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "@vue/eslint-config-typescript",
    "@vue/eslint-config-prettier/skip-formatting",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/electron",
    "plugin:import/typescript",
    "plugin:vue/vue3-essential",
    "./.eslintrc-auto-import.json",

    // "eslint:recommended",
    // "@vue/eslint-config-typescript",
    // "@vue/eslint-config-prettier/skip-formatting",
    // "plugin:@typescript-eslint/eslint-recommended",
    // "plugin:@typescript-eslint/recommended",
    // "plugin:import/recommended",
    // "plugin:import/electron",
    // "plugin:import/typescript",
    // "./.eslintrc-auto-import.json"
  ],
  parserOptions: {
    ecmaVersion: "latest",
  },
  parser: "@typescript-eslint/parser",
  rules: {
    "no-console": "off",
    "no-debugger": "off",
    "vue/multi-word-component-names": "off",
    "import/no-unresolved": "off",
    "@typescript-eslint/no-non-null-assertion": "off",
    "@typescript-eslint/no-unused-vars": 1,
    "no-unused-vars": 1,
    "@typescript-eslint/no-empty-function": 1,
    "@typescript-eslint/no-explicit-any": 1,
    "@typescript-eslint/no-require-imports": 0,
  },
  globals: {
    MAIN_WINDOW_VITE_DEV_SERVER_URL: "readonly",
    MAIN_WINDOW_VITE_NAME: "readonly",
  },
};
