import { Prisma } from "@prisma/client";
import prisma from "../../../framework/config/prisma.js";

export const loginHistoryRepository = {
  async create(
    userId: number,
    ip: string,
    userAgent: string,
    tx?: Prisma.TransactionClient
  ): Promise<void> {
    const client = tx ?? prisma;
    await client.loginHistory.create({
      data: {
        user_id: userId,
        ip_address: ip,
        user_agent: userAgent,
      },
    });
  },
};
