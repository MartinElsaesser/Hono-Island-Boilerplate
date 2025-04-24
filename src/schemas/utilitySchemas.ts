import z from 'zod';

export const stringToIntegerSchema = z
  .string()
  .regex(/^\d+$/)
  .transform((val) => parseInt(val, 10));
