import { z } from "zod";

export const userStatusSchema = z.enum(["active", "inactive", "locked", "suspended"]);

export const listUsersSchema = z.object({
  cursor: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().min(1).max(200).optional(),
  page: z.coerce.number().int().positive().optional(),
  perPage: z.coerce.number().int().min(1).max(200).optional(),
});

export const updateUserSchema = z.object({
  status: userStatusSchema.optional(),
  first_name: z.string().min(2).max(50).regex(/^[A-Za-z]+$/).optional(),
  last_name: z.string().min(2).max(50).regex(/^[A-Za-z]+$/).optional(),
  avatar_file_id: z.number().int().positive().nullable().optional(),
});

export type ListUsersInput = z.infer<typeof listUsersSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
