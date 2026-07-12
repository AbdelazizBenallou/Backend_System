import type { Request } from "express";

interface UserPayload {
  userId: number;
  email: string;
  roles: string[];
}

declare global {
  namespace Express {
    interface Request {
      user?: UserPayload;
      refreshPayload?: { userId: number; email: string };
    }
  }
}
