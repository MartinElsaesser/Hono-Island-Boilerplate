// --- imports
// get all react components that are registered to run on the client
import { registeredIslands } from './shared.js';

// provide necessary imports to render islands on the client
import { parse } from 'superjson';
import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';

// get zod schemas for validating island information
import { z } from 'zod';

export const islandIndexSchema = z
  .string()
  .regex(/^\d+$/)
  .transform((val) => parseInt(val, 10))
  .refine((index) => registeredIslands[index] !== undefined);

export const propsSchema = z.string().transform((val) => parse(val));

// --- code for hydration, i.e. rendering islands on the client
// get all html elements that wrap islands
const islandWrappers = Array.from(
  document.querySelectorAll('[data-island-index]')
);

if (islandWrappers.length > 0) {
  for (const wrapper of islandWrappers) {
    // get island index and props from the wrapper element
    // island index will tell us which island to render
    // props will be used to achieve the same state as on the server

    const rawIslandIdx = wrapper.getAttribute('data-island-index');
    const { data: islandIdx, error: error1 } =
      islandIndexSchema.safeParse(rawIslandIdx);
    if (error1) throw new Error(`Invalid island index: ${rawIslandIdx}`);

    const rawProps = wrapper.getAttribute('data-island-props');
    const { data: props, error: error2 } = propsSchema.safeParse(rawProps);
    if (error2) throw new Error(`Empty props: ${rawProps}`);

    // find matching island in the islands object
    const island = registeredIslands[islandIdx];

    const root = createRoot(wrapper);
    root.render(jsx(island, props));
  }
}
