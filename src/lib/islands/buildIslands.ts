import { type BuildOptions, build } from "esbuild";
const baseBuildOptions: BuildOptions = {
	// TODO: should .ts, .jsx, .js also be included?
	entryPoints: ["./src/components/**/*.tsx"],
	bundle: true,
	minify: false,
	sourcemap: "inline",
	format: "esm",
	outdir: "./static/build",
	chunkNames: "[name]-[hash]",
	splitting: true,
};

export function buildIslands(overWriteOptions?: Partial<BuildOptions>) {
	return build({
		...baseBuildOptions,
		...overWriteOptions,
	})
		.then(() => console.log("Islands built successfully."))
		.catch((error: unknown) => {
			console.error("Error building islands:", error);
		});
}
