import { useState } from "hono/jsx";

export function useInput(initState: string) {
	// utility to bind a value to an input
	// sets the value and onChange properties on the input
	const [hook, setHook] = useState(initState);

	function handleChange(e: Event) {
		const target = e.target as HTMLInputElement
		setHook(target.value)
	}

	return {
		value: hook,
		onChange: handleChange
	}
}