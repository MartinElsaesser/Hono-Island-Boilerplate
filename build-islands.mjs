// @ts-check
import * as esbuild from 'esbuild';
import { readFile, rm, rmdir } from 'fs/promises';

/** @type {import('esbuild').BuildOptions} */
const buildOptions = {
  entryPoints: ['src/islands/client.tsx'],
  bundle: true,
  minify: false,
  format: 'esm',
  outdir: '/static/js/build',
  chunkNames: '[name]-[hash]',
  splitting: true,
};

// delete last build files
await rm(import.meta.dirname + '/static/js/build', {
  force: true,
  recursive: true,
});

///////////////////////
// start esbuild
const startInDevMode = process.argv.includes('--watch');

if (startInDevMode) {
  console.log('Started watch mode for client files');

  // watch and re-transpile typescript files on change
  let ctx = await esbuild.context(buildOptions);
  await ctx.watch();
} else {
  console.log('Building client files');

  // transpile typescript files
  let ctx = await esbuild.build(buildOptions);
}
