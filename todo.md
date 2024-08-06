# Todo List
- [ ] Island hydration

	- [ ] improve build step
		- [ ] [load render deps only once](#load-render-deps-once)

	- [ ] improve dx of islands
		- [ ] add error message when an island is within another island
		- [ ] add .island.tsx extension?
		- [ ] try out react
			- [ ] for better error handling?
			- [ ] better code splitting?

	- [ ] documentation
		- [ ] write documenation
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