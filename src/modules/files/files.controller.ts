import type { Request, Response } from "express";
import fs from "node:fs";
import { response } from "../../../framework/utils/response.js";
import { asyncHandler } from "../../../framework/middleware/asyncHandler.js";
import { filesService } from "./files.service.js";

export const filesController = {
  upload: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const category = (req.query?.category as string) || (req.body?.category as string) || "other";
    const files = req.files as Express.Multer.File[];

    if (!files || files.length === 0) {
      response.error(res, "No files provided", 400);
      return;
    }

    if (category === "video" && files.length > 1) {
      response.error(res, "Only one video file allowed per upload", 400);
      return;
    }

    const { data, errors } = await filesService.uploadWithErrors(userId, files, category);

    if (errors.length > 0 && data.length === 0) {
      res.status(400).json({ success: false, message: "All files were rejected", errors });
      return;
    }

    if (errors.length > 0) {
      res.status(201).json({
        success: true,
        message: `${data.length} file(s) uploaded, ${errors.length} error(s)`,
        data,
        errors,
      });
      return;
    }

    response.success(res, data, "Files uploaded successfully", 201);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const fileId = Number(req.params.id);
    if (isNaN(fileId)) {
      response.error(res, "Invalid file ID", 400);
      return;
    }

    const file = await filesService.getFile(fileId, req.user!.userId, req.user!.roles);
    response.success(res, file, "File fetched successfully");
  }),

  download: asyncHandler(async (req: Request, res: Response) => {
    const fileId = Number(req.params.id);
    if (isNaN(fileId)) {
      response.error(res, "Invalid file ID", 400);
      return;
    }

    const file = await filesService.getFile(fileId, req.user!.userId, req.user!.roles);
    const filePath = filesService.getFilePath(file);

    if (!fs.existsSync(filePath)) {
      response.error(res, "File not found on disk", 404);
      return;
    }

    const disposition = req.query.disposition === "attachment" ? "attachment" : "inline";

    res.setHeader("Content-Type", file.mime_type);
    res.setHeader("Content-Disposition", `${disposition}; filename="${file.original_name}"`);
    res.setHeader("Content-Length", file.size);
    res.setHeader("X-Accel-Redirect", `/private-files/${file.category}/${file.stored_name}`);
    res.end();
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.userId;
    const files = await filesService.getUserFiles(userId);
    response.success(res, files, "Files fetched successfully");
  }),

  remove: asyncHandler(async (req: Request, res: Response) => {
    const fileId = Number(req.params.id);
    if (isNaN(fileId)) {
      response.error(res, "Invalid file ID", 400);
      return;
    }

    await filesService.deleteFile(fileId, req.user!.userId, req.user!.roles);
    response.success(res, null, "File deleted successfully");
  }),
};
