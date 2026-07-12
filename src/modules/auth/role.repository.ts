import prisma from "../../../framework/config/prisma.js";

export const roleRepository = {
  async findByName(name: string): Promise<{ role_id: number } | null> {
    return prisma.role.findUnique({
      where: { name },
      select: { role_id: true },
    });
  },

  async getRolesByUserId(userId: number): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { user_id: userId },
      include: { role: { select: { name: true } } },
    });

    return userRoles.map((ur) => ur.role.name);
  },

  async getPermissionsByUserId(userId: number): Promise<string[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { user_id: userId },
      include: {
        role: {
          include: {
            role_permission: {
              include: { permission: true },
            },
          },
        },
      },
    });

    return userRoles.flatMap((ur) =>
      ur.role.role_permission.map((rp) => rp.permission.name)
    );
  },
};
