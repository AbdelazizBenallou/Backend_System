import type { Request, Response, NextFunction } from "express";
import { response } from "../utils/response.js";

export const notFound = (_req: Request, res: Response, _next: NextFunction): void => {
  response.error(res, "Route not found", 404);
};
