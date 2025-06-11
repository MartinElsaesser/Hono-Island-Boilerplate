import { useState } from "react";
import { registerIsland } from "../islands/client.js";

export default function Counter({ $count }: { $count: number }) {
	const [count, setCount] = useState($count);

	return (
		<div>
			<div>
				<button onClick={e => setCount(c => c - 1)}>-</button>
				<span>{count}</span>
				<button onClick={e => setCount(c => c + 1)}>+</button>
			</div>
		</div>
	);
}

registerIsland(Counter, import.meta);
