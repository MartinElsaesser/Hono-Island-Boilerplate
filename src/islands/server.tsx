import React from "react";
import superjson from "superjson";
import { isIslandComponent, ISLAND_BUILD_PATH, ISLAND_INDEX } from "./client.js";

export default function Island({ children }: { children: React.ReactElement }) {
	try {
		// TODO: format zod error messages in a readable way

		// TODO: check that the Island component is not within another Island component (use a context to track this)

		if (!React.isValidElement(children)) {
			throw Error("Not a valid React element.");
		}

		if (!isIslandComponent(children.type)) {
			throw new Error(
				`"${children.type}" is not a user defined component, or it was not registered correctly with registerIslands().`
			);
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
