import React from 'react';
import serialize from 'serialize-javascript';
import { registeredIslands } from './shared.js';

export default async function Island({
  children,
}: {
  children: React.ReactElement;
}) {
  // goal: only allow imports matching /src/islands/**/[name].tsx
  // if goal is not met: throw an error
  // note: ** means zero or more directories

  try {
    // try embedding component
    if (!React.isValidElement(children)) {
      throw Error('only components are valid children');
    }

    // throw error if IslandComponent is not a functional component
    if (typeof children.type !== 'function') {
      throw new Error(
        `Island component "${children.type}" is not a functional component`
      );
    }

    const islandIdx = registeredIslands.findIndex(
      (island) => island === children.type
    );
    if (islandIdx === -1) {
      throw new Error(
        `Island component "${children.type.name}" is not registered as an island. Please add it to the registeredIslands array.`
      );
    }

    return (
      // TODO: serialize `children.props` such that Maps, Sets and Dates are supported
      <div
        data-hydration-island-idx={islandIdx}
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
