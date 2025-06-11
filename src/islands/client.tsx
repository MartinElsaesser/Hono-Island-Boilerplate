import { runsOnServer } from "../lib/runsOnServer.js";
import { parse } from "superjson";
import { createRoot } from "react-dom/client";
import { jsx } from "react/jsx-runtime";
import { z } from "zod";

export const islandSchema = z.object({
	islandProps: z.string().transform(val => parse(val)),
	islandBuildPath: z.string().min(1),
	islandIndex: z.coerce.number(), // TODO: improve this to be safer
});

let calledInFiles = new Set<string>();

export const ISLAND_INDEX = "islandIndex";
export const ISLAND_BUILD_PATH = "islandBuildPath";

// TODO: change this to accept a list of components, so that each component is only hydrated once
// TODO: validate that the component is a valid react component
export function registerIslands({
	components,
	meta,
}: {
	components: Function[];
	meta: ImportMeta;
}) {
	const islandBuildPath = resolveComponentBuildPath(meta.url);

	// ensure that registerIslands is called only once per file
	if (calledInFiles.has(meta.url)) {
		throw new Error(`registerIslands was called multiple times in the same file`);
	}
	calledInFiles.add(meta.url);

	components.forEach((component, islandIndex) => {
		// TODO: validate that the component is a valid react component
		if (component[ISLAND_INDEX] === undefined) {
			Object.defineProperty(component, ISLAND_INDEX, {
				value: islandIndex,
				writable: false,
				enumerable: true,
			});
			Object.defineProperty(component, ISLAND_BUILD_PATH, {
				value: islandBuildPath,
				writable: false,
				enumerable: true,
			});
		}
	});

	if (!runsOnServer()) {
		// client-side rendering
		// get all html elements that wrap islands
		const islandWrappers = Array.from(document.querySelectorAll("[data-island-build-path]"));

		for (const wrapper of islandWrappers) {
			// get island index and props from the wrapper element
			// island index will tell us which island to render
			// props will be used to achieve the same state as on the server

			const { islandIndex, islandBuildPath, islandProps } = islandSchema.parse(
				wrapper.dataset
			);

			const component = components[islandIndex];

			if (
				component === undefined ||
				component[ISLAND_INDEX] !== islandIndex ||
				component[ISLAND_BUILD_PATH] !== islandBuildPath
			) {
				continue;
			}

			const root = createRoot(wrapper);
			root.render(jsx(component, islandProps));
		}
	}
}

/**
 * This function takes in a react component's file URL.\
 * Those file URLs can come from server and client.\
 * Regardless of where the code is running, it resolves the file URL to the same path.\
 * This path is used to load the component's javascript on the client side and to hydrate it.\
 * @example
 * // Shows the different URLs for server and client:
 * // Both URLs will resolve to the same path.
 * const server = "file:///C:/Users/.../src/components/Counter.tsx";
 * const client = "http://localhost:3000/static/build/Counter.js";
 * const path = "/static/build/Counter.js";
 *
 * @param path - The file URL of the component.
 * @returns The resolved path for the component.
 */
function resolveComponentBuildPath(path: string) {
	if (runsOnServer()) {
		// server: file:///C:/Users/.../src/components/Counter.tsx
		const regex = /^file:.*src\/components\//;
		const resolvedPath = path.replace(regex, "/static/build/").replace(/\.tsx$/, ".js");
		return resolvedPath;
	} else {
		// client: http://localhost:3000/static/build/Counter.js
		const resolvedPath = path.replace(location.origin, "");
		return resolvedPath;
	}
}
