import typescript from '@rollup/plugin-typescript'
import resolve from '@rollup/plugin-node-resolve'
import svelte from 'rollup-plugin-svelte';
import pkg from './package.json'
import copy from 'rollup-plugin-copy'

const outputPath = "dist"
let externalModules = pkg.peerDependencies ? Object.keys(pkg.peerDependencies) : []
let localModules = ["dom", "components", "transitions"]

let plugins = [
    resolve({
        extensions: [".mjs", ".js"],
    }),
    typescript(),
    svelte({
        include: "src/components/**/*.svelte",
    }),
    copy({
      targets: [
        { src: './nativescript.webpack.js', dest: `${outputPath}/` },
        { src: './svelte.config.js', dest: `${outputPath}/` },
      ]
    })
];

function module_defs() {
  return localModules.map(mod => {
    return {
      input: `src/${mod}/index.ts`,
      output: [{
        file: `${outputPath}/${mod}/index.js`,
        format: 'esm',
      }],
      external: (id) => [...externalModules, ...localModules.filter(m => m != mod).map(m => `../${m}`)].some(prefix => id.startsWith(prefix)),
      plugins: plugins
    }
  })

}

export default [
  {
    input: 'src/index.ts',
    output: [{
      dir: `./${outputPath}`,
      entryFileNames: "index.js",
      format: 'esm',
    }
    ],
    external: (id) => [...externalModules, ...localModules.map(m => `./${m}`)].some(prefix => id.startsWith(prefix)),
    plugins: plugins
  },
  ...module_defs()
];