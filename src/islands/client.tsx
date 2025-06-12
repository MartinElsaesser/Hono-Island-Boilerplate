import { runsOnServer } from "../lib/runsOnServer.js";
import { parse } from "superjson";
import { hydrateRoot } from "react-dom/client";
import { z } from "zod";
import { ComponentType } from "react";
import { intersectAnyWithObject } from "../schemas/utilitySchemas.js";

export const wrapperSchema = z.object({
	islandProps: z.string().transform(val => parse(val)),
	islandBuildPath: z.string().min(1),
	islandIndex: z.coerce.number(), // TODO: improve this to be safer
});

let calledInFiles = new Set<string>();

export const ISLAND_INDEX = "islandIndex";
export const ISLAND_BUILD_PATH = "islandBuildPath";

const islandInfoSchema = z.object({
	islandIndex: z.number(),
	islandBuildPath: z.string(),
});

const componentSchema = z.custom<ComponentType<any>>(value => {
	return z.function().safeParse(value).success;
});

const islandComponentSchema = intersectAnyWithObject({
	anySchema: componentSchema,
	objectSchema: islandInfoSchema,
});
const maybeIslandComponentSchema = intersectAnyWithObject({
	anySchema: componentSchema,
	objectSchema: islandInfoSchema.partial(),
});

export function isIslandComponent(
	value: ComponentType<any>
): value is z.infer<typeof islandComponentSchema> {
	return islandComponentSchema.safeParse(value).success;
}

function maybeIslandComponent(
	value: ComponentType<any>
): value is ComponentType<any> & z.infer<typeof maybeIslandComponentSchema> {
	return maybeIslandComponentSchema.safeParse(value).success;
}

// component: functional component, or class component
// element: <FC />, or <CC />
//

// island lifecycle:
// 	SERVER
// 		normal React component: Component
// 		react component with tracking information: islandComponent
// 		react component as jsx (cannot be used in Island): jsxElement
// 		react component with tracking information as jsx (can be used in Island): islandElement
//      react components rendered to HTML
// 	CLIENT
// 		normal React component
// 		react component with tracking information
// 		react component as jsx
// 		react component with tracking information rendered to HTML

// TODO: change this to accept a list of components, so that each component is only hydrated once
// TODO: validate that the component is a valid react component
export function registerIslands({
	components,
	meta,
}: {
	components: ComponentType<any>[];
	meta: ImportMeta;
}) {
	const islandBuildPath = resolveComponentBuildPath(meta.url);

	// ensure that registerIslands is called only once per file
	if (calledInFiles.has(meta.url)) {
		throw new Error(`registerIslands was called multiple times in the same file`);
	}
	calledInFiles.add(meta.url);

	const islandComponents = components.map((component, islandIndex) => {
		// TODO: validate that the component is a valid react component
		if (!maybeIslandComponent(component)) {
			throw new Error(`Component at index ${islandIndex} is not a valid island component.`);
		}
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
		if (!isIslandComponent(component)) {
			throw new Error(`Component at index ${islandIndex} is not a valid island component.`);
		}
		return component;
	});

	if (!runsOnServer()) {
		// client-side rendering
		// get all html elements that wrap islands
		const islandWrappers = Array.from(
			document.querySelectorAll(`[data-island-build-path="${islandBuildPath}"]`)
		) as HTMLElement[];
		console.log(islandWrappers);

		for (const wrapper of islandWrappers) {
			// get island index and props from the wrapper element
			// island index will tell us which island to render
			// props will be used to achieve the same state as on the server

			const { islandIndex, islandBuildPath, islandProps } = wrapperSchema.parse(
				wrapper.dataset
			);

			const Component = islandComponents[islandIndex];

			if (Component === undefined) {
				// TODO: improve this error message
				throw new Error(`Island component at index ${islandIndex} is not defined.`);
			}

			const root = hydrateRoot(wrapper, <Component {...islandProps} />);
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
