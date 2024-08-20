import { z } from "zod";

export const createOrEditGroupSchema = z.object({
  name: z
    .string()
    .min(1, "Name must be 1 character at least")
    .max(200, "Name must be 200 characters or less"),
  description: z
    .string()
    .max(1024, "Name must be 1024 characters or less")
    .optional(),
  isPrivate: z.boolean(),
});

export type CreateOrEditGroupInput = z.infer<typeof createOrEditGroupSchema>;