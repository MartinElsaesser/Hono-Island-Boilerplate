import { useState, Component } from "react";
import { registerIslands } from "../islands/client.js";

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

registerIslands({
	meta: import.meta,
	components: [
		TestCounter1,
		TestCounter2,
		TestCounter3,
		TestCounter4,
		TestCounter5,
		TestCounter6,
		TestCounter7,
		TestCounter8,
	] satisfies Function[],
});
