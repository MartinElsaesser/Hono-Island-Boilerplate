export * from "./react-renderer.js";

export interface Props {}

declare module "hono" {
	interface ContextRenderer {
		(children: React.ReactElement, props?: Props): Response | Promise<Response>;
	}
}
