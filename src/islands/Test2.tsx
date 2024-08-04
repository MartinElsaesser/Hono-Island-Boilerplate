import { useState } from "hono/jsx";

export default function Test() {
	const [test, setTest] = useState("test");
	
	return (
		<div>
			<h1>{test}</h1>
		</div>
	)
}