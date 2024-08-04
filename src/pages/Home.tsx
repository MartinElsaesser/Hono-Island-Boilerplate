import Island from "../Island";
import NameDisplay from "../islands/NameDisplay";

export default function Home() {
	return (
		<>
			<Island src="NameDisplay.js">
				<NameDisplay initialName="Martin"></NameDisplay>
			</Island>
			<Island src="NameDisplay.js">
				<NameDisplay initialName="Nathan"></NameDisplay>
			</Island>
		</>
	)
}