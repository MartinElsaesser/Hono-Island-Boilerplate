import { registeredIslands } from './shared.js';
import z from 'zod';

// provide necessary imports for hydration
import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';

const islandWrappers = Array.from(
  document.querySelectorAll('[data-hydration-island-idx]')
);

const strToIntSchema = z
  .string()
  .regex(/^\d+$/)
  .transform((val) => parseInt(val, 10));
const propsSchema = z.string().transform((val) => JSON.parse(val));

if (islandWrappers.length > 0) {
  for (const wrapper of islandWrappers) {
    const rawIslandIdx = wrapper.getAttribute('data-hydration-island-idx');
    const { data: islandIdx, error: error1 } =
      strToIntSchema.safeParse(rawIslandIdx);
    if (error1) throw new Error(`Invalid island index: ${rawIslandIdx}`);

    const rawProps = wrapper.getAttribute('data-hydration-props');
    const { data: props, error: error2 } = propsSchema.safeParse(rawProps);
    if (error2) throw new Error(`Empty props: ${rawProps}`);

    // find matching island in the islands object
    const island = registeredIslands[islandIdx];

    const root = createRoot(wrapper);
    root.render(jsx(island, props));
  }
}
