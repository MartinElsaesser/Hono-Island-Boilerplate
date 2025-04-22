const islandWrappers = Array.from(
  document.querySelectorAll('[data-hydration-src]')
);

if (islandWrappers.length > 0) {
  for (const wrapper of islandWrappers) {
    const src = wrapper.getAttribute('data-hydration-src');
    console.log(`hydrating ${src}`);

    const {
      default: islands,
      __createRoot__,
      __jsx__,
    } = await import('/static/js/islands/islands.js');

    const props = JSON.parse(wrapper.getAttribute('data-hydration-props'));
    const root = __createRoot__(wrapper);

    // find matching island in the islands object
    const island = Object.values(islands).find(
      (island) => island.hydrationId === src
    );
    root.render(__jsx__(island, props));
  }
}
