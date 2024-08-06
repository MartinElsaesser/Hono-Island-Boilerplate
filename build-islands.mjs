import * as esbuild from 'esbuild'
import { readFile } from 'fs/promises';

/**
 * @file
 * Contains the build step for island components:
 * 1. take files matching /src/islands/[Name].tsx
 * 2. add dependencies for client side rendering
 * 3. bundle the files and transform them to javascript
 * 4. save them to /static/js/islands/[Name].js.
 *
 * rendering of the island components is handled in /static/js/hydrate.mjs
 * @param "--watch" - starts the build in watch mode
 */

/**
 * plugin adds packages for client side rendering (CSR)
 */
let plugin_addCSRPackages = {
	name: "add-csr-deps",
	setup(build) {
		const renderDependencies = `
				import { render as HonoJsxRender_ClientExpose} from "hono/jsx/dom"
				import { jsx as HonoJsx_ClientExpose } from "hono/jsx/jsx-runtime";
				export {HonoJsxRender_ClientExpose, HonoJsx_ClientExpose };
			`;

		build.onLoad({ filter: /\.tsx$/ }, async (args) => {
			// load tsx file
			let tsxFile = await readFile(args.path, "utf-8");

			// append packages for client side rendering
			tsxFile += renderDependencies;

			// pass component on to the build step
			return {
				contents: tsxFile,
				loader: "tsx"
			}
		});
	}
}

///////////////////////
// esbuild config
const buildOptions = {
	entryPoints: ['src/islands/*.tsx'],
	bundle: true,
	minify: false,
	format: "esm",
	outdir: '/static/js/islands',
	plugins: [plugin_addCSRPackages]
}

///////////////////////
// start esbuild
const startInWatchMode = process.argv.includes("--watch")

if (startInWatchMode) {
	console.log("Started watch mode for client files");

	// watch and re-transpile typescript files on change
	let ctx = await esbuild.context(buildOptions);
	await ctx.watch();
} else {
	console.log("Building client files");

	// transpile typescript files
	await esbuild.build(buildOptions);
}
