import type { ComponentType } from "react";
import { z } from "zod";
import { islandComponentSchema, maybeIslandComponentSchema } from "../schema.js";

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
export function runsOnServer(): boolean {
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
export function resolveComponentBuildPath(path: string) {
	if (runsOnServer()) {
		// server: file:///C:/Users/.../src/components/Counter.tsx
		// TODO: should be configurable; and needs to work together with the buildIslands() function
		const regex = /^file:.*src\/components\//;
		const resolvedPath = path.replace(regex, "/static/build/").replace(/\.tsx$/, ".js");
		return resolvedPath;
	} else {
		// client: http://localhost:3000/static/build/Counter.js
		const resolvedPath = path.replace(location.origin, "");
		return resolvedPath;
	}
}
