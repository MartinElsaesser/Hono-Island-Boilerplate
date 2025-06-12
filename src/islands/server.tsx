import React from "react";
import superjson from "superjson";
import { isIslandComponent, ISLAND_BUILD_PATH, ISLAND_INDEX } from "./client.js";

export default function Island({ children }: { children: React.ReactElement }) {
	try {
		// TODO: use zod for validation
		// - check that children is a valid react element (functional component or class component)
		// - check that islandBuildPath and islandIndex are valid strings
		// - check props? (maybe not necessary, since props are passed as-is)

		// TODO: use zod for casting: the component should be cast in a way that import and path are added to the component type

		// TODO: format zod error messages in a readable way

		// TODO: check that the Island component is not within another Island component (use a context to track this)

		// check if children is a valid react element
		if (!React.isValidElement(children)) {
			throw Error("only components are valid children");
		}

		// throw error if children is not a functional component
		if (!isIslandComponent(children.type)) {
			throw new Error(`Island component "${children.type}" is not a functional component`);
		}

		return (
			<>
				<div
					data-island-props={superjson.stringify(children.props)}
					data-island-build-path={children.type[ISLAND_BUILD_PATH]}
					data-island-index={children.type[ISLAND_INDEX]}
				>
					{children}
				</div>
				<script src={children.type[ISLAND_BUILD_PATH]} type="module"></script>
			</>
		);
	} catch (error: unknown) {
		// display errors
		let message = "";

		if (typeof error === "string") {
			message = error;
		} else if (error instanceof Error) {
			message = error.message;
		}

		return (
			<div style={{ color: "red", background: "lightgrey" }}>
				Island Error &gt;&gt; {message}
			</div>
		);
	}
}
