import type { ComponentType } from "react";
import { hydrateIslandComponents } from "./client.js";
import { ISLAND_BUILD_PATH, ISLAND_INDEX } from "./schema.js";
import {
	resolveComponentBuildPath,
	maybeIslandComponent,
	isIslandComponent,
	runsOnServer,
} from "./utils/shared.js";

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
