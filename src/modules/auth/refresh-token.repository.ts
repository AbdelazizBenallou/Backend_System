import { Prisma } from "@prisma/client";
import prisma from "../../../framework/config/prisma.js";

export const refreshTokenRepository = {
  async create(
    userId: number,
    tokenHash: string,
    expiresAt: Date,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? prisma;
    await client.refreshToken.create({
      data: {
        user_id: userId,
        token: tokenHash,
        expires_at: expiresAt,
      },
    });
  },

  async findValidByUserId(userId: number): Promise<{ refresh_token_id: number; token: string }[]> {
    return prisma.refreshToken.findMany({
      where: {
        user_id: userId,
        revoked: false,
        expires_at: { gt: new Date() },
      },
      select: { refresh_token_id: true, token: true },
    });
  },

  async revokeById(id: number): Promise<void> {
    await prisma.refreshToken.update({
      where: { refresh_token_id: id },
      data: { revoked: true },
    });
  },
};
