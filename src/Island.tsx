import React from 'react';
import serialize from 'serialize-javascript';

/**
 *
 * throw an error if the island component violates either criteria:
 * * IslandComponent is a functional component
 * * default export from pathToComponent equals island component
 * @param pathToComponent - path to island component
 * @param IslandComponent - island component
 */
async function verifyComponentImport(
  pathToComponent: string,
  IslandComponent: React.ReactElement
) {
  // default import the contents from pathToComponent
  // default import is expected to equal IslandComponent
  const relativePathToComponent = pathToComponent.slice('/src/'.length);
  const { default: ImportedComponent } = await import(
    `./${relativePathToComponent}`
  );

  // throw error if IslandComponent is not a functional component
  if (typeof IslandComponent.type !== 'function') {
    throw new Error(
      `Island component "${IslandComponent.type}" is not a functional component`
    );
  }

  // throw error if IslandComponent does not match Imported Component
  if (IslandComponent.type !== ImportedComponent) {
    throw new Error(
      `Island component "${IslandComponent.type.name}" does not match the one from pathToComponent "${ImportedComponent.name}"`
    );
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

  // throw error if pathToComponent differs from /src/islands/.../[name].tsx
  if (!absolutePathToIslandsDir.test(path)) {
    // ** means zero or more directories
    throw new Error(
      `{pathToComponent: "${path}"} needs to macht "/src/islands/**/[name].tsx"`
    );
  }

  // throw error if /../ is found in componentPath
  if (goBacksInPath.test(path)) {
    throw new Error(`{pathToComponent:"${path}"} contains illegal "/../"`);
  }
}

export default async function Island({
  children,
  pathToComponent,
}: {
  children: React.ReactElement;
  pathToComponent: string;
}) {
  // goal: only allow imports matching /src/islands/**/[name].tsx
  // if goal is not met: throw an error
  // note: ** means zero or more directories

  try {
    // try embedding component
    if (!React.isValidElement(children)) {
      throw Error('only components are valid children');
    }
    throwOnFaultyComponentPath(pathToComponent);
    await verifyComponentImport(pathToComponent, children);
    const regex_filePathNoExt = /^\/src\/islands\/(.*)\.tsx$/;
    const filePathNoExt = regex_filePathNoExt.exec(pathToComponent)![1];

    return (
      // TODO: serialize `children.props` such that Maps, Sets and Dates are supported
      <div
        data-hydration-src={`/static/js/islands/${filePathNoExt}.js`}
        data-hydration-props={JSON.stringify(children.props)}
      >
        {children}
      </div>
    );
  } catch (error: unknown) {
    // display errors
    let message = '';

    if (typeof error === 'string') {
      message = error;
    } else if (error instanceof Error) {
      message = error.message;
    }

    return (
      <div style={{ color: 'red', background: 'lightgrey' }}>
        Island Error &gt;&gt; {message}
      </div>
    );
  }
}
