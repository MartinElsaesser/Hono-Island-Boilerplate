import Counter from './Counter.js';
import TodoApp from './TodoApp.js';
import React from 'react';

function registerIslands<T extends Record<string, React.FC<any>>>(
  components: T
) {
  let index = 0;
  for (const key in components) {
    components[key].hydrationId = `island-${index}`;
    index++;
  }

  return components;
}

export default registerIslands({ Counter, TodoApp });
