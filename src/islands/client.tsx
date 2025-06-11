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
let islands: Record<string, number> = {};

// TODO: change this to accept a list of components, so that each component is only hydrated once
// TODO: allow only one call per file
// TODO: validate that the component is a valid react component
export function registerIslands({
	components,
	meta,
}: {
	components: Function[];
	meta: ImportMeta;
}) {
	const islandBuildPath = resolveComponentBuildPath(meta.url);

	components.forEach((component, islandIndex) => {
		// TODO: validate that the component is a valid react component
		if (component.islandIndex === undefined) {
			Object.defineProperty(component, "islandIndex", {
				value: islandIndex,
				writable: false,
				enumerable: true,
			});
			Object.defineProperty(component, "islandBuildPath", {
				value: islandBuildPath,
				writable: false,
				enumerable: true,
			});
		}
	});

	if (!runsOnServer()) {
		// client-side rendering
		console.log("testing client-side rendering");

		// --- code for hydration, i.e. rendering islands on the client
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
				component.islandIndex === islandIndex &&
				component.islandBuildBuildPath === islandBuildPath
			)
				continue;

			console.log(islandIndex, wrapper);

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
		console.log(resolvedPath);
		return resolvedPath;
	}
}
