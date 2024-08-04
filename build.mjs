import * as esbuild from 'esbuild'


const options = {
	entryPoints: ['src/islands/*.tsx'],
	bundle: true,
	minify: false,
	format: "esm",
	metafile: true,
	outdir: '/static/js/islands',
}

const watch = true;

if (watch) {
	let ctx = await esbuild.context(options);
	await ctx.watch();
} else {
	const result = await esbuild.build(options);
	console.log(result.metafile)
}