import { ComponentType } from "react";
import { hydrateIslandComponents } from "./client.js";
import { z } from "zod";
import {
	ISLAND_BUILD_PATH,
	ISLAND_INDEX,
	islandComponentSchema,
	maybeIslandComponentSchema,
} from "./schema.js";

let calledInFiles = new Set<string>();
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
		throw new Error(`registerIslands() was called multiple times in the same file`);
	}
	calledInFiles.add(meta.url);

	const islandComponents = components.map((component, islandIndex) => {
		if (!maybeIslandComponent(component)) {
			throw new Error(`Component at index ${islandIndex} is not a valid react component.`);
		}
		if (component[ISLAND_INDEX] === undefined && component[ISLAND_BUILD_PATH] === undefined) {
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
			throw new Error(
				`Something went wrong with the component at index ${islandIndex}, did you set one of theses properties: islandIndex, islandBuildPath on the component?`
			);
		}
		return component;
	});

	if (!runsOnServer()) {
		// client-side rendering
		// get all html elements that wrap islands
		hydrateIslandComponents(islandBuildPath, islandComponents);
	}
}

export function isIslandComponent(value: any): value is z.infer<typeof islandComponentSchema> {
	return islandComponentSchema.safeParse(value).success;
}

export function maybeIslandComponent(
	value: any
): value is ComponentType<any> & z.infer<typeof maybeIslandComponentSchema> {
	return maybeIslandComponentSchema.safeParse(value).success;
}

/**
 * Function to determine if the code is running on the server or client.
 * @returns {boolean} - Returns true if running on the server, false if on the client.
 */
function runsOnServer(): boolean {
	return typeof window === "undefined";
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
