import * as esbuild from 'esbuild'
import { readFile } from 'fs/promises';

/**
 * @file Configures the build step for island components
 */

/**
 * load .tsx files  
 * append packages for client rendering to the code  
 * and pass the modified files along to the build step
 */
let addRenderDepsToIslands = {
	name: "add-render-deps",
	setup(build) {
		const renderDependencies = `
				import { render as HonoJsxRender_ClientExpose} from "hono/jsx/dom"
				import { jsx as HonoJsx_ClientExpose } from "hono/jsx/jsx-runtime";
				export {HonoJsxRender_ClientExpose, HonoJsx_ClientExpose };
			`;

		build.onLoad({ filter: /\.tsx$/ }, async (args) => {
			let tsxFile = await readFile(args.path, "utf-8");
			tsxFile += renderDependencies;
			return {
				contents: tsxFile,
				loader: "tsx"
			}
		});
	}
}


let ctx = await esbuild.context({
	entryPoints: ['src/islands/*.tsx'],
	bundle: true,
	minify: false,
	format: "esm",
	metafile: true,
	outdir: '/static/js/islands',
	plugins: [addRenderDepsToIslands]
});

await ctx.watch();