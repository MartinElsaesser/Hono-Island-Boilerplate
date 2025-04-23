import Counter from './Counter.js';
import TodoApp from './TodoApp.js';
import React from 'react';

// register islands
export default [Counter, TodoApp];

// provide necessary imports for hydration
import { createRoot } from 'react-dom/client';
import { jsx } from 'react/jsx-runtime';
export { jsx as __jsx__, createRoot as __createRoot__ };
