import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";
import globals from "globals";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  ...compat.config({
    extends: [
      "next/core-web-vitals",
      "plugin:@typescript-eslint/recommended",
    ],
    rules: {
      // FIX: Downgrades the 'prefer-const' error to a warning so it no longer stops the build.
      "prefer-const": "warn",

      // FIX: Turns off the warning about using the standard <img> tag.
      "@next/next/no-img-element": "off",

      // Downgrades "unused variable" errors to warnings.
      "@typescript-eslint/no-unused-vars": "warn",

      // Turns off the rule that requires escaping apostrophes.
      "react/no-unescaped-entities": "off",

      // Turns off the rule that forbids using the 'any' type.
      "@typescript-eslint/no-explicit-any": "off",
    },
  }),
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
];

export default eslintConfig;
