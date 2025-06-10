import React from "react";
import superjson from "superjson";

export default function Island({ children }: { children: React.ReactElement }) {
	try {
		// check if children is a valid react element
		if (!React.isValidElement(children)) {
			throw Error("only components are valid children");
		}

		// throw error if children is not a functional component
		if (typeof children.type !== "function") {
			throw new Error(`Island component "${children.type}" is not a functional component`);
		}

		// TODO: error handling

		return (
			<div
				data-island-props={superjson.stringify(children.props)}
				data-island-path={children.type.path}
				data-island-import={children.type.import}
			>
				{children}
				<script src={children.type.path} type="module"></script>
			</div>
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
