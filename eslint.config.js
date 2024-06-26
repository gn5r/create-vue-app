import globals from "globals";
import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
  { ignores: ["node_modules", "dist", "template"] },
  { languageOptions: { globals: globals.node } },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/ban-types": "warn",
    },
  },
  {
    files: ["**/*.cjs"],
    rules: {
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];
