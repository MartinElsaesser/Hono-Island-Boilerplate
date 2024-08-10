import { raw } from "hono/html";
import { JSXNode } from "hono/jsx";
import serialize from "serialize-javascript";


/**
 *
 * throw an error if the island component violates either criteria:
 * * IslandComponent is a functional component
 * * default export from pathToComponent equals island component
 * @param pathToComponent - path to island component
 * @param IslandComponent - island component
 */
async function verifyComponentImport(pathToComponent: string, IslandComponent: JSXNode) {
	// default import the contents from pathToComponent
	// default import is expected to equal IslandComponent
	const relativePathToComponent = pathToComponent.slice("/src/".length);
	const { default: ImportedComponent } = await import(`./${relativePathToComponent}`);

	// throw error if IslandComponent is not a functional component
	if (typeof IslandComponent.tag !== "function") {
		throw new Error(`Island component "${IslandComponent.tag}" is not a functional component`);
	}

	// throw error if IslandComponent does not match Imported Component
	if (ImportedComponent !== IslandComponent.tag) {
		throw new Error(`Island component "${IslandComponent.tag.name}" does not match the one from pathToComponent "${ImportedComponent.name}"`);
	}
}

/**
 *
 * throw an error if the path violates either criteria:
 * * path matches `/src/islands/.../[name].tsx`
 * * and does not contain /../
 * @param path - path to an island component
 */
function throwOnFaultyComponentPath(path: string) {

	const absolutePathToIslandsDir = /^\/src\/islands\/.*\.tsx$/;
	const goBacksInPath = /\/..\//;

	// throw error if /../ is found in componentPath
	if (goBacksInPath.test(path)) {
		throw new Error(`"/../" not allowed in {pathToComponent:"${path}"}`); }
	
	// throw error if pathToComponent differs from /src/islands/.../[name].tsx
	if (!absolutePathToIslandsDir.test(path)) {
		// ** means zero or more directories
		throw new Error(`pattern "/src/islands/**/[name].tsx" not adhered to by {pathToComponent: "${path}"}`); 
	}
}


export default async function Island({ children, pathToComponent }: { children: any, pathToComponent: string }) {
	// goal: only allow imports matching /src/islands/**/[name].tsx
	// if goal is not met: throw an error
	// note: ** means zero or more directories


	try {
		throwOnFaultyComponentPath(pathToComponent);
		await verifyComponentImport(pathToComponent, children)
		const regex_filePathNoExt = /^\/src\/islands\/(.*)\.tsx$/;
		const filePathNoExt = regex_filePathNoExt.exec(pathToComponent)![1];

		return (
			<div data-hydration-src={`/static/js/islands/${filePathNoExt}.js`} data-hydration-props={JSON.stringify(children.props)}>
				{children}
			</div>
		)
	} catch (error: unknown)  {
		let message = "Island.tsx error";

    if (typeof error === "string") {
        message = error;
    } else if (error instanceof Error) {
        message = error.message;
    }

		return (
			<div style="color: red; background: lightgrey;">
				Island.tsx Error &gt;&gt; {message}
			</div>
		)
		
	}
}