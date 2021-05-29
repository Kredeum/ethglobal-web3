import svelte from "rollup-plugin-svelte";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import livereload from "rollup-plugin-livereload";
import { terser } from "rollup-plugin-terser";
import json from "@rollup/plugin-json";
import css from "rollup-plugin-css-only";
import builtins from "rollup-plugin-node-builtins";

const production = process.env.PROD;

function serve() {
  let server;

  function toExit() {
    if (server) server.kill(0);
  }

  return {
    writeBundle() {
      if (server) return;
      server = require("child_process").spawn("npm", ["run", "start", "--", "--dev"], {
        stdio: ["ignore", "inherit", "inherit"],
        shell: true
      });

      process.on("SIGTERM", toExit);
      process.on("exit", toExit);
    }
  };
}

const toRollupConfig = function (component, dest, customElement = true) {
  return {
    input: "svelte/" + component + (customElement ? ".svelte" : ".js"),
    output: {
      sourcemap: !production,
      format: "iife",
      name: component.replace(/-/g, "_"),
      file: `${dest}/${component}.js`
    },
    plugins: [
      svelte({
        compilerOptions: {
          customElement,
          dev: !production
        }
      }),
      css({ output: `${dest}/${component}.css` }),
      resolve({
        browser: true,
        dedupe: ["svelte"],
        preferBuiltins: false
      }),
      builtins(),
      json(),
      commonjs(),
      !production && serve(),
      !production && livereload("public"),
      production && terser()
    ],
    watch: {
      clearScreen: false
    },
    onwarn: function (warning) {
      if (warning.code === "THIS_IS_UNDEFINED") {
        return;
      }
      console.warn(warning.message);
    }
  };
};

export default [
  // toRollupConfig("kredeum-metamask", "dapp/build"), // metamask.html
  toRollupConfig("nfts-list", "dapp/build")
];
