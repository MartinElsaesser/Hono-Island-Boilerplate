import * as esbuild from 'esbuild'
import { readFile } from 'fs/promises';

let addRenderDepsToIslands = {
	name: "example",
	setup(build) {
		build.onLoad({ filter: /\.tsx$/ }, async (args) => {
			let text = await readFile(args.path, "utf-8");
			text += `\
				import { render as HonoJsxRender_ClientExpose} from "hono/jsx/dom"
				import { jsx as HonoJsx_ClientExpose } from "hono/jsx/jsx-runtime";
				export {HonoJsxRender_ClientExpose, HonoJsx_ClientExpose };
			`

			return {
				contents: text,
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