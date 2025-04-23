import { useState } from 'react';

export default function Counter({ initialCount }: { initialCount: number }) {
  const [count, setCount] = useState(initialCount);

  return (
    <div>
      <div>
        <button onClick={(e) => setCount((c) => c - 1)}>-</button>
        <span>{count}</span>
        <button onClick={(e) => setCount((c) => c + 1)}>+</button>
      </div>
    </div>
  );
}
