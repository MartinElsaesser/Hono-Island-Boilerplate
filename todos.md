# Todo List
- [ ] Island hydration

	- [ ] improve build step
		- [ ] [load render deps only once](#load-render-deps-once)
		- [ ] add options to build-islands.mjs
			- [ ] minify
			- [ ] watch (**change to watch: true**)
		- [ ] [copy files when building](https://www.npmjs.com/package/esbuild-plugin-copy?ref=blog.bitbriks.com)

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


### load render deps once
- [ ] import once
	- [ ] import render deps once from esm.sh
	- [ ] import render deps once from bundled `.ts` file
- [x] import multiple times
	- [x] bundle render deps with every component

* having one import for the render deps seems impossible at the time beeing
* things tried:
	* use extra `.ts` file only for the render deps; import it into hydrate.mjs
	* import render deps from esm.sh into hydrate.mjs
* things to try:
	* import render deps via node_modules
	* switch to deno; try esm.sh
* things to research:
	* what mechanism forces the render function to be bundled with the component?