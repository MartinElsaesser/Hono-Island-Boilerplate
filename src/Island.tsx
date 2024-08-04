import { raw } from "hono/html";
import serialize from "serialize-javascript";

export default function Island({children, src}: {children: any, src: string}) {
	return (
		<div data-hydration-src={`/static/js/islands/${src}` }data-hydration-props={JSON.stringify(children.props)}>
			{children}
		</div>
	)
}