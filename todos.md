# Todo List
- [ ] Island hydration

	- [ ] improve build step
		- [x] [load render deps only once](#load-render-deps-once)
		- [ ] add cli options to build-islands.mjs
			- [ ] minify
			- [ ] watch (**change to watch: true**)
			- [ ] enable chunking
		- [ ] improve linking of island component source
		- [ ] [copy files when building](https://www.npmjs.com/package/esbuild-plugin-copy?ref=blog.bitbriks.com)
		- [ ] add css styles
			* [tailwind via esbuild plugin](https://www.npmjs.com/package/esbuild-plugin-tailwindcss)
			* [tailwind via esbuild & postcss](https://stackoverflow.com/questions/70716940/using-tailwind-css-with-esbuild-the-process/72723786#72723786)
			* hono css
			* [css modules via esbuild plugin](https://www.npmjs.com/package/esbuild-css-modules-plugin)
			* [vanilla extract](https://www.npmjs.com/package/@vanilla-extract/esbuild-plugin)
			* native css

	- [ ] improve dx of islands
		- [ ] add error message when an island is within another island
		- [ ] add .island.tsx extension?
		- [ ] add debugger
			- [ ] source maps
				- [ ] separate build script which generates source maps
				- [x] add source maps
				- [ ] turn source maps off for production build
			- [ ] options
				- [ ] any ts/tsx file
				- [ ] server
		- [ ] try out react
			- [ ] for better error handling?
			- [ ] better code splitting?

	- [ ] documentation
		- [ ] write documentation
		- [ ] draw diagrams
		- [ ] add code comments


- [ ] fullstack features
	- [ ] add client + server flash
	- [ ] add tailwind
	- [ ] add sessions + flash

- [ ] check if architecture is feasible
	- [ ] test different versions of node (problems with top level await?)
	- [ ] test different browsers (problems with esm modules?)

### load render deps once
- [x] import once
	- achieved by enabling code splitting in esbuild

* having one import for the render deps seems impossible at the time beeing
* things tried:
	* use extra `.ts` file only for the render deps; import it into hydrate.mjs
	* import render deps from esm.sh into hydrate.mjs
* things to try:
	* import render deps via node_modules
	* switch to deno; try esm.sh
* things to research:
	* what mechanism forces the render function to be bundled with the component?