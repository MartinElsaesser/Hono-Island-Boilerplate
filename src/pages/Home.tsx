import Island from "../Island.js";
import NameDisplay from "../islands/NameDisplay.js";

export default function Home() {
	return (
		<>
			<Island src="NameDisplay.js">
				<NameDisplay initialName="Martin"></NameDisplay>
			</Island>
		</>
	)
}