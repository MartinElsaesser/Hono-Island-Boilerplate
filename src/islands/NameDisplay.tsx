import { useInput } from "../lib/useInput";

export default function NameDisplay({ initialName }: { initialName: string }) {
	const name = useInput(initialName);

	return (
		<div>
			<h1>{name.value}</h1>
			<input type="text" {...name} />
		</div>
	)
}

// want to get rid of -  (dependencies for client side reactivity)
//                     |
//                     v
import {render} from "hono/jsx/dom"
import { jsx } from "hono/jsx/jsx-runtime";
export {render, jsx};