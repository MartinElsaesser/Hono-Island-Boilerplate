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

export const TestCounter4 = function () {
	const [count, setCount] = useState(0);

	return <button onClick={e => setCount(c => c + 1)}>{count} (+1)</button>;
};

function createComponent1() {
	return function () {
		const [count, setCount] = useState(0);

		return <button onClick={e => setCount(c => c + 1)}>{count} (+1)</button>;
	};
}
function createComponent2() {
	return () => {
		const [count, setCount] = useState(0);

		return <button onClick={e => setCount(c => c + 1)}>{count} (+1)</button>;
	};
}
function createComponent3() {
	return function Component() {
		const [count, setCount] = useState(0);

		return <button onClick={e => setCount(c => c + 1)}>{count} (+1)</button>;
	};
}

export const TestCounter5 = TestCounter1;

export const TestCounter6 = createComponent1();
export const TestCounter7 = createComponent2();
export const TestCounter8 = createComponent3();

registerIsland(TestCounter1, import.meta);
registerIsland(TestCounter2, import.meta);
registerIsland(TestCounter3, import.meta);
registerIsland(TestCounter4, import.meta);
registerIsland(TestCounter5, import.meta);
registerIsland(TestCounter6, import.meta);
registerIsland(TestCounter7, import.meta);
registerIsland(TestCounter8, import.meta);

const a: ImportMeta = import.meta;
type lel = ImportMeta;
type debug = typeof a;
