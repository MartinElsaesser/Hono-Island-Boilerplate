import { registeredIslands } from './shared.js';

// provide necessary imports for hydration
import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';

// TODO: remove ! and handle not found cases
const islandWrappers = Array.from(
  document.querySelectorAll('[data-hydration-island-idx]')
);

if (islandWrappers.length > 0) {
  for (const wrapper of islandWrappers) {
    // TODO: add explicit type conversion
    const src = +wrapper.getAttribute('data-hydration-island-idx')!;
    console.log(`hydrating ${src}`);

    const props = JSON.parse(wrapper.getAttribute('data-hydration-props')!);
    const root = createRoot(wrapper);

    // find matching island in the islands object
    const island = registeredIslands[src];
    root.render(jsx(island, props));
  }
}
