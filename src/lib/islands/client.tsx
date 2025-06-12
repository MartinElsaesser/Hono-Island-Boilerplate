import { hydrateRoot } from "react-dom/client";
import { type IslandComponent, wrapperSchema } from "./schema.js";

export function hydrateIslandComponents(
	islandBuildPath: string,
	islandComponents: IslandComponent[]
) {
	const islandWrappers = Array.from(
		document.querySelectorAll(`[data-island-build-path="${islandBuildPath}"]`)
	) as HTMLElement[];

	for (const wrapper of islandWrappers) {
		// get island index and props from the wrapper element
		// island index will tell us which island to render
		// props will be used to achieve the same state as on the server
		const { islandIndex, islandProps } = wrapperSchema.parse(wrapper.dataset);

		const Component = islandComponents[islandIndex];

		if (Component === undefined) {
			throw new Error(`Unexpected error: no Island component found at index ${islandIndex}.`);
		}

		const root = hydrateRoot(wrapper, <Component {...islandProps} />);
	}
}
