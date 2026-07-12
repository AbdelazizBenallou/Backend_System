import prisma from "../../../framework/config/prisma.js";

export interface FileRecord {
  file_id: number;
  user_id: number;
  original_name: string;
  stored_name: string;
  mime_type: string;
  size: number;
  category: string;
  created_at: Date;
}

function toResponse(file: any): FileRecord {
  return {
    file_id: file.file_id,
    user_id: file.user_id,
    original_name: file.original_name,
    stored_name: file.stored_name,
    mime_type: file.mime_type,
    size: file.size,
    category: file.category,
    created_at: file.created_at,
  };
}

export const filesRepository = {
  async create(data: {
    user_id: number;
    original_name: string;
    stored_name: string;
    mime_type: string;
    size: number;
    category: string;
  }): Promise<FileRecord> {
    const file = await prisma.file.create({ data });
    return toResponse(file);
  },

  async findById(id: number): Promise<FileRecord | null> {
    const file = await prisma.file.findUnique({ where: { file_id: id } });
    return file ? toResponse(file) : null;
  },

  async findByUserId(userId: number): Promise<FileRecord[]> {
    const files = await prisma.file.findMany({
      where: { user_id: userId },
      orderBy: { created_at: "desc" },
    });
    return files.map(toResponse);
  },

  async delete(id: number): Promise<void> {
    await prisma.file.delete({ where: { file_id: id } });
  },
};
