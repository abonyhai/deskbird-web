import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import angular from "@angular-eslint/eslint-plugin";
import angularTemplate from "@angular-eslint/eslint-plugin-template";
import prettier from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"],
    plugins: { js, import: importPlugin },
    extends: ["js/recommended", "plugin:import/recommended", "plugin:import/typescript", "prettier"],
    rules: {
      "import/order": ["error", { "alphabetize": { "order": "asc" }, "groups": [["builtin", "external", "internal"]] }],
    },
  },
  {
    files: ["**/*.ts"],
    plugins: { "@angular-eslint": angular },
    extends: ["plugin:@angular-eslint/recommended"],
    rules: {},
  },
  {
    files: ["**/*.html"],
    plugins: { "@angular-eslint/template": angularTemplate },
    extends: ["plugin:@angular-eslint/template/recommended"],
    rules: {},
  },
  { files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], languageOptions: { globals: globals.browser } },
  tseslint.configs.recommended,
]);
