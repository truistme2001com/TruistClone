import { z } from "zod";

export const loginSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(1, "Password is required"),
  saveUserId: z.boolean().optional(),
});

export type LoginRequest = z.infer<typeof loginSchema>;

export interface LoginResponse {
  success: boolean;
  message: string;
  userId?: string;
}
