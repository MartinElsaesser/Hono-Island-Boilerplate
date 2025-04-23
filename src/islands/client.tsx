import { registeredIslands } from './shared.js';

// provide necessary imports for hydration
import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';
import {
  stringToIntegerSchema,
  hydrationPropsSchema,
} from '../schemas/utilitySchemas.js';

// code for client hydration
const islandWrappers = Array.from(
  document.querySelectorAll('[data-hydration-island-idx]')
);

if (islandWrappers.length > 0) {
  for (const wrapper of islandWrappers) {
    const rawIslandIdx = wrapper.getAttribute('data-hydration-island-idx');
    const { data: islandIdx, error: error1 } =
      stringToIntegerSchema.safeParse(rawIslandIdx);
    if (error1) throw new Error(`Invalid island index: ${rawIslandIdx}`);

    const rawProps = wrapper.getAttribute('data-hydration-props');
    const { data: props, error: error2 } =
      hydrationPropsSchema.safeParse(rawProps);
    if (error2) throw new Error(`Empty props: ${rawProps}`);

    // find matching island in the islands object
    const island = registeredIslands[islandIdx];

    const root = createRoot(wrapper);
    root.render(jsx(island, props));
  }
}
