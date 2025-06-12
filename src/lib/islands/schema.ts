import { ComponentType } from "react";
import z from "zod";
import { parse } from "superjson";

export const ISLAND_INDEX = "islandIndex";
export const ISLAND_BUILD_PATH = "islandBuildPath";

function intersectAnyWithObject<TAny extends z.ZodTypeAny, TObj extends z.AnyZodObject>({
	anySchema,
	objectSchema,
}: {
	anySchema: TAny;
	objectSchema: TObj;
}) {
	return z.custom<z.infer<TAny> & z.infer<TObj>>(val => {
		const extractObjProps: Record<string, any> = {};
		for (const key of objectSchema.keyof().options as string[]) {
			extractObjProps[key] = val?.[key];
		}

		const isAny = anySchema.safeParse(val).success;
		const validProps = objectSchema.safeParse(extractObjProps).success;
		return isAny && validProps;
	});
}

const islandInfoSchema = z.object({
	[ISLAND_INDEX]: z.number(),
	[ISLAND_BUILD_PATH]: z.string(),
});
const componentSchema = z.custom<ComponentType<any>>(value => {
	return z.function().safeParse(value).success;
});
export const islandComponentSchema = intersectAnyWithObject({
	anySchema: componentSchema,
	objectSchema: islandInfoSchema,
});
export const maybeIslandComponentSchema = intersectAnyWithObject({
	anySchema: componentSchema,
	objectSchema: islandInfoSchema.partial(),
});

export type IslandComponent = z.infer<typeof islandComponentSchema>;
export type MaybeIslandComponent = z.infer<typeof maybeIslandComponentSchema>;

export const wrapperSchema = z.object({
	islandProps: z.string().transform(val => parse(val)),
	islandBuildPath: z.string().min(1),
	islandIndex: z.coerce.number(), // TODO: improve this to be safer
});
