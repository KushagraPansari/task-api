import prettierConfig from "eslint-config-prettier";

export default [
  {
    languageOptions: {
      ecmaVersion: 2024,      // understand modern JS syntax
      sourceType: "module",    // understand import/export  
    },
    rules: {
      "no-unused-vars": ["error", { argsIgnorePattern: "^_|next|req|res" }],
      // ^ catch unused variables but allow _req, _res, next patterns

      "no-console": "warn",
      // ^ remind you to use logger instead of console.log

      "prefer-const": "error",
      // ^ force const when variable is never reassigned
    },
  },
  prettierConfig,
  // ^ disable ESLint rules that conflict with Prettier
];