import type { Request, Response, NextFunction } from "express";
import { response } from "../utils/response.js";

export function handleMulterError(err: any, _req: Request, res: Response, next: NextFunction): void {
  if (!err) {
    next();
    return;
  }

  const message = err.message || "Upload failed";
  if (message.includes("Invalid category") || message.includes("not allowed")) {
    response.error(res, message, 400);
  } else if (message.includes("File too large")) {
    response.error(res, message, 413);
  } else {
    response.error(res, message, 500);
  }
}
