const islands = Array.from(document.querySelectorAll("[data-hydration-src]"));
if (islands.length > 0) {
	// const { render } = await import("https://esm.sh/hono/jsx/dom"); // from hono/jsx/dom


	// this works fine, but the following line is better. hono/jsx/jsx-runtime includes server-side rendering support
	// const { jsx: _jsx } = await import("https://esm.sh/hono/jsx/jsx-runtime");
	// const { jsx: _jsx } = await import("https://esm.sh/hono/jsx/dom/jsx-runtime"); // dom-specific version. this doesn't include server-side rendering support
	for (const island of islands) {
		const src = island.getAttribute("data-hydration-src");
		console.log(`hydrating ${src}`);

		const { default: Component, HonoJsxRender_ClientExpose, HonoJsx_ClientExpose } = await import(src);
		const props = JSON.parse(island.getAttribute("data-hydration-props"));
		HonoJsxRender_ClientExpose(HonoJsx_ClientExpose(Component, props), island);
	}
}