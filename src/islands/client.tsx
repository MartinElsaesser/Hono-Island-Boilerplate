// --- imports
// get all react components that are registered to run on the client
import { registeredIslands } from './shared.js';

// provide necessary imports to render islands on the client
import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';

// get zod schemas for validating island information
import {
  stringToIntegerSchema,
  hydrationPropsSchema,
} from '../schemas/utilitySchemas.js';

// --- code for hydration, i.e. rendering islands on the client
// get all html elements that wrap islands
const islandWrappers = Array.from(
  document.querySelectorAll('[data-hydration-island-idx]')
);

if (islandWrappers.length > 0) {
  for (const wrapper of islandWrappers) {
    // get island index and props from the wrapper element
    // island index will tell us which island to render
    // props will be used to achieve the same state as on the server

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
