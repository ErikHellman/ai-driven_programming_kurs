import js from "@eslint/js";
import globals from "globals";

export default [
  // Fikalistan har fel inbyggda med flit (övning 2), så den lintas inte
  { ignores: ["node_modules/", "ovningar/fikalistan/"] },
  js.configs.recommended,
  {
    files: ["assets/**/*.js"],
    languageOptions: { sourceType: "script", globals: globals.browser },
  },
  {
    files: ["*.js", "tests/**/*.js"],
    languageOptions: { globals: globals.node },
  },
];
