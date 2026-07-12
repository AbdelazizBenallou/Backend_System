import fs from "node:fs";
import path from "node:path";
import { env } from "../../../framework/config/env.js";
import { AppError } from "../../../framework/utils/AppError.js";
import { scanFile } from "../../../framework/utils/scanner.js";
import { filesRepository } from "./files.repository.js";
import { MIMETYPE_MAP } from "../../../framework/middleware/upload.js";

export const filesService = {
  async saveFile(
    userId: number,
    file: Express.Multer.File,
    category: string,
  ) {
    if (env.MALWARE_SCANNER_ENABLED) {
      const result = await scanFile(file.path);
      if (!result.clean) {
        try { fs.unlinkSync(file.path); } catch { /* ignore */ }
        throw new AppError(`File rejected by malware scanner: ${result.threat}`, 422);
      }
    }

    const record = await filesRepository.create({
      user_id: userId,
      original_name: file.originalname,
      stored_name: file.filename,
      mime_type: file.mimetype,
      size: file.size,
      category,
    });

    const targetDir = path.join(env.UPLOAD_DIR, category);
    const targetPath = path.join(targetDir, file.filename);
    fs.mkdirSync(targetDir, { recursive: true });
    fs.renameSync(file.path, targetPath);

    return record;
  },

  async upload(userId: number, file: Express.Multer.File, category: string) {
    return this.saveFile(userId, file, category);
  },

  async uploadMany(
    userId: number,
    files: Express.Multer.File[],
    category: string,
  ) {
    const records = await Promise.all(
      files.map((file) => this.saveFile(userId, file, category)),
    );
    return records;
  },

  async uploadWithErrors(
    userId: number,
    files: Express.Multer.File[],
    category: string,
  ) {
    const allowed = MIMETYPE_MAP[category] || MIMETYPE_MAP.other;
    const data: any[] = [];
    const errors: string[] = [];

    for (const file of files) {
      if (!allowed.includes(file.mimetype)) {
        errors.push(`"${file.originalname}": File type ${file.mimetype} not allowed for category "${category}"`);
        try { fs.unlinkSync(file.path); } catch { /* already gone */ }
        continue;
      }

      try {
        const record = await this.saveFile(userId, file, category);
        data.push(record);
      } catch (err: any) {
        errors.push(`"${file.originalname}": ${err.message}`);
        try { fs.unlinkSync(file.path); } catch { /* already gone */ }
      }
    }

    return { data, errors };
  },

  async getFile(fileId: number, userId: number, userRoles: string[]) {
    const file = await filesRepository.findById(fileId);
    if (!file) throw new AppError("File not found", 404);

    const isAdmin = userRoles.some((r) => r === "admin");
    if (file.user_id !== userId && !isAdmin) {
      throw new AppError("Forbidden", 403);
    }

    return file;
  },

  async getUserFiles(userId: number) {
    return filesRepository.findByUserId(userId);
  },

  async deleteFile(fileId: number, userId: number, userRoles: string[]) {
    const file = await filesRepository.findById(fileId);
    if (!file) throw new AppError("File not found", 404);

    const isAdmin = userRoles.some((r) => r === "admin");
    if (file.user_id !== userId && !isAdmin) {
      throw new AppError("Forbidden", 403);
    }

    const filePath = path.join(env.UPLOAD_DIR, file.category, file.stored_name);
    try { fs.unlinkSync(filePath); } catch { /* file already missing */ }

    await filesRepository.delete(fileId);
  },

  getFilePath(file: { category: string; stored_name: string }): string {
    return path.join(env.UPLOAD_DIR, file.category, file.stored_name);
  },
};
