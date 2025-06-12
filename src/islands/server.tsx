import React, { createContext, use, useContext } from "react";
import superjson from "superjson";
import { isIslandComponent, ISLAND_BUILD_PATH, ISLAND_INDEX, registerIslands } from "./client.js";

const RegistrationContext = createContext(false);

export default function Island({ children }: { children: React.ReactElement }) {
	try {
		// TODO: format zod error messages in a readable way

		const withinAnotherIsland = useContext(RegistrationContext);
		if (withinAnotherIsland) {
			throw Error("Island components cannot be nested within each other.");
		}

		if (!React.isValidElement(children)) {
			throw Error("Not a valid React element.");
		}

		if (!isIslandComponent(children.type)) {
			const identifier =
				typeof children.type === "function" ? children.type.name : children.type;
			throw new Error(
				`"${identifier}" is not a user defined component, or it was not registered correctly with registerIslands().`
			);
		}

		return (
			<RegistrationContext value={true}>
				<div
					data-island-props={superjson.stringify(children.props)}
					data-island-build-path={children.type[ISLAND_BUILD_PATH]}
					data-island-index={children.type[ISLAND_INDEX]}
				>
					{children}
				</div>
				<script src={children.type[ISLAND_BUILD_PATH]} type="module"></script>
			</RegistrationContext>
		);
	} catch (error: unknown) {
		// display errors
		console.error(error);
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
