import { useState, Component } from "react";

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
