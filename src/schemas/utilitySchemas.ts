import z from "zod";

export const stringToIntegerSchema = z
	.string()
	.regex(/^\d+$/)
	.transform(val => parseInt(val, 10));

export function intersectAnyWithObject<TAny extends z.ZodTypeAny, TObj extends z.AnyZodObject>({
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
