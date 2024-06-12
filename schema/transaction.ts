import { z } from "zod";

// Creating a zod object
/**
 * name : CreateTransactionsSchema
 */
export const CreateTransactionSchema = z.object({
  amount: z.coerce.number().positive().multipleOf(0.01),
  description: z.string().optional(),
  date: z.coerce.date(),
  category: z.string(),
  type: z.union([z.literal("income"), z.literal("expense")]),
});

//Extracting the infered Type from the Above Schema
export type CreateTransactionSchemaType = z.infer<
  typeof CreateTransactionSchema
>;
