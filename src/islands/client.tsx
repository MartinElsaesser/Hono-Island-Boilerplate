// --- imports

// provide necessary imports to render islands on the client
import { parse } from "superjson";
import { createRoot } from "react-dom/client";
import { jsx } from "react/jsx-runtime";

// zod schemas for validating island information
import { z } from "zod";

export const islandPropsSchema = z.string().transform(val => parse(val));

export const islandSchema = z.object({
	islandProps: islandPropsSchema,
	islandPath: z.string().min(1),
	islandImport: z.string().min(1),
});

// --- code for hydration, i.e. rendering islands on the client
// get all html elements that wrap islands
const islandWrappers = Array.from(document.querySelectorAll("[data-island-path]"));

if (islandWrappers.length > 0) {
	for (const wrapper of islandWrappers) {
		// get island index and props from the wrapper element
		// island index will tell us which island to render
		// props will be used to achieve the same state as on the server

		const { islandImport, islandPath, islandProps } = islandSchema.parse(wrapper.dataset);

		// find matching island in the islands object
		const island = (await import(islandPath)).default;

		console.log(island);

		const root = createRoot(wrapper);
		root.render(jsx(island, islandProps));
	}
}
