import prettierConfig from "eslint-config-prettier";

export default [
  {
    languageOptions: {
      ecmaVersion: 2024,      
      sourceType: "module",  
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_|next|req|res" }],

      "no-console": "warn",

      "prefer-const": "error",
    },
  },
  prettierConfig,
];