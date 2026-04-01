import js from "@eslint/js";
import jest from "eslint-plugin-jest";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig,globalIgnores } from "eslint/config";

export default defineConfig([
  { 
    files: ["**/*.{js,mjs,cjs,ts,mts,cts}"], 
    plugins: { js }, 
    extends: ["js/recommended"], 
    languageOptions: { 
      globals: globals.browser,
    }
  },
  globalIgnores([ "_site/**", "node_modules/**" ]),
  tseslint.configs.recommended,
  {
    files: ["**/*.test.{js,mjs,cjs,ts,mts,cts}"],
    ...jest.configs["flat/recommended"]
  }
]);
