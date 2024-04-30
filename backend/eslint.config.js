import globals from "globals";
import pluginJs from "@eslint/js";


export default [
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
      rules: {
            "semi": "error",
        "no-unused-vars": "error",
            
        } 
  },
  {
    languageOptions:
      { globals: globals.browser }
  },
  pluginJs.configs.recommended,
];