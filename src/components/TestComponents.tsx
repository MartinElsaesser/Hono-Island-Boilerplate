import { useState, Component } from "react";
import { registerIsland } from "../islands/client.js";

export function TestCounter1() {
	const [count, setCount] = useState(0);

	return <button onClick={e => setCount(c => c + 1)}>{count} (+1)</button>;
}

export const TestCounter2 = () => {
	const [count, setCount] = useState(0);

	return <button onClick={e => setCount(c => c + 1)}>{count} (+1)</button>;
};

export class TestCounter3 extends Component<{}, { count: number }> {
	state = { count: 0 };
	render() {
		return <button onClick={() => this.increment(1)}>{this.state.count} (+1)</button>;
	}
	increment = (amt: number) => {
		// like this
		this.setState(state => ({
			count: state.count + amt,
		}));
	};
}

export const TestCounter4 = TestCounter1;
export const TestCounter5 = TestCounter2;
export const TestCounter6 = TestCounter3;

registerIsland(TestCounter1, import.meta.url);
registerIsland(TestCounter2, import.meta.url);
registerIsland(TestCounter3, import.meta.url);
registerIsland(TestCounter4, import.meta.url);
registerIsland(TestCounter5, import.meta.url);
registerIsland(TestCounter6, import.meta.url);
