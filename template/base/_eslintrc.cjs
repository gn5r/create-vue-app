module.exports = {
  env: {
    node: true,
    browser: true,
    es2022: true,
  },
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["vue", "@typescript-eslint/eslint-plugin"],
  extends: [
    "plugin:@typescript-eslint/recommended",
    "plugin:vue/vue3-essential",
    "@vue/typescript/recommended",
  ],
  ignorePatterns: [".eslintrc.js"],
  rules: {
    "vue/multi-word-component-names": "off",
  },
};
