import js from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig(
  {
    ignores: ["coverage/**", "dist/**", "node_modules/**", "src/generated/**"],
  },
  {
    files: ["**/*.ts"],
    extends: [js.configs.recommended, tseslint.configs.recommended],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
        },
      ],
    },
  },
  configPrettier,
);
