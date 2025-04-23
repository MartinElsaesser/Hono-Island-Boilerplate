import z from 'zod';

export const stringToIntegerSchema = z
  .string()
  .regex(/^\d+$/)
  .transform((val) => parseInt(val, 10));

export const hydrationPropsSchema = z
  .string()
  .transform((val) => JSON.parse(val));
