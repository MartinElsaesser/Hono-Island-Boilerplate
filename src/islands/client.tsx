// --- imports
// provide necessary imports to render islands on the client
import { runsOnServer } from "../lib/runsOnServer.js";
import { parse } from "superjson";
import { createRoot } from "react-dom/client";
import { jsx } from "react/jsx-runtime";

// zod schemas for validating island information
import { z } from "zod";

export const islandPropsSchema = z.string().transform(val => parse(val));

export const islandSchema = z.object({
	islandProps: islandPropsSchema,
	islandPath: z.string().min(1),
	islandImport: z.string().min(1),
});

export function registerIsland(component: Function, fileUrl: string) {
	const path = resolveBuildPath(fileUrl);
	component.import = component.name;
	component.path = path;

	if (!runsOnServer()) {
		// client-side rendering
		console.log("testing client-side rendering");

		// --- code for hydration, i.e. rendering islands on the client
		// get all html elements that wrap islands
		const islandWrappers = Array.from(document.querySelectorAll("[data-island-path]"));

		for (const wrapper of islandWrappers) {
			// get island index and props from the wrapper element
			// island index will tell us which island to render
			// props will be used to achieve the same state as on the server

			const { islandImport, islandPath, islandProps } = islandSchema.parse(wrapper.dataset);
			if (islandImport !== component.import || islandPath !== component.path) continue;

			// find matching island in the islands object

			const root = createRoot(wrapper);
			root.render(jsx(component, islandProps));
		}
	}
}

function resolveBuildPath(path: string) {
	if (runsOnServer()) {
		// server: file:///C:/Users/marel/Programming/Typescript/zod-playground/Hono-Island-Boilerplate/src/components/Counter.tsx
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
