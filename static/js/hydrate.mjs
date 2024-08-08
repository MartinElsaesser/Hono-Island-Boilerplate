const islands = Array.from(document.querySelectorAll("[data-hydration-src]"));

if (islands.length > 0) {
	for (const island of islands) {
		const src = island.getAttribute("data-hydration-src");
		console.log(`hydrating ${src}`);

		const { default: Component, __jsx__, __render__ } = await import(src);

		const props = JSON.parse(island.getAttribute("data-hydration-props"));
		__render__(__jsx__(Component, props), island);
	}
}