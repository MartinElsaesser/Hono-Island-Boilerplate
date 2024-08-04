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

