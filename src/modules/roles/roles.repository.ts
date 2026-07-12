import prisma from "../../../framework/config/prisma.js";

type PermissionResponse = {
  permission_id: number;
  name: string;
};

export const roleRepository = {
  async findAll(): Promise<{ role_id: number; name: string }[]> {
    return prisma.role.findMany({
      select: { role_id: true, name: true },
      orderBy: { role_id: "asc" },
    });
  },

  async findById(id: number): Promise<{ role_id: number; name: string } | null> {
    return prisma.role.findUnique({
      where: { role_id: id },
      select: { role_id: true, name: true },
    });
  },

  async findByName(name: string): Promise<{ role_id: number } | null> {
    return prisma.role.findUnique({
      where: { name },
      select: { role_id: true },
    });
  },

  async create(name: string): Promise<{ role_id: number; name: string }> {
    return prisma.role.create({
      data: { name },
      select: { role_id: true, name: true },
    });
  },

  async update(id: number, name: string): Promise<{ role_id: number; name: string }> {
    return prisma.role.update({
      where: { role_id: id },
      data: { name },
      select: { role_id: true, name: true },
    });
  },

  async countUsersByRoleId(id: number): Promise<number> {
    return prisma.userRole.count({ where: { role_id: id } });
  },

  async delete(id: number): Promise<void> {
    await prisma.role.delete({ where: { role_id: id } });
  },

  async findAllPermissions(): Promise<PermissionResponse[]> {
    return prisma.permission.findMany({
      select: { permission_id: true, name: true },
      orderBy: { permission_id: "asc" },
    });
  },

  async findPermissionById(id: number): Promise<PermissionResponse | null> {
    return prisma.permission.findUnique({
      where: { permission_id: id },
      select: { permission_id: true, name: true },
    });
  },

  async findPermissionByName(name: string): Promise<{ permission_id: number } | null> {
    return prisma.permission.findUnique({
      where: { name },
      select: { permission_id: true },
    });
  },

  async createPermission(name: string): Promise<PermissionResponse> {
    return prisma.permission.create({
      data: { name },
      select: { permission_id: true, name: true },
    });
  },

  async updatePermission(id: number, name: string): Promise<PermissionResponse> {
    return prisma.permission.update({
      where: { permission_id: id },
      data: { name },
      select: { permission_id: true, name: true },
    });
  },

  async countRolesByPermissionId(id: number): Promise<number> {
    return prisma.rolePermission.count({ where: { permission_id: id } });
  },

  async deletePermission(id: number): Promise<void> {
    await prisma.permission.delete({ where: { permission_id: id } });
  },

  async getPermissionsByRoleId(roleId: number): Promise<PermissionResponse[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { role_id: roleId },
      include: { permission: { select: { permission_id: true, name: true } } },
    });

    return rolePermissions.map((rp) => rp.permission);
  },

  async addPermissionToRole(roleId: number, permissionId: number): Promise<void> {
    await prisma.rolePermission.create({
      data: { role_id: roleId, permission_id: permissionId },
    });
  },

  async removePermissionFromRole(roleId: number, permissionId: number): Promise<void> {
    await prisma.rolePermission.delete({
      where: { role_id_permission_id: { role_id: roleId, permission_id: permissionId } },
    });
  },

  async isPermissionAssignedToRole(roleId: number, permissionId: number): Promise<boolean> {
    const rp = await prisma.rolePermission.findUnique({
      where: { role_id_permission_id: { role_id: roleId, permission_id: permissionId } },
    });
    return rp !== null;
  },

  async findUserById(id: number): Promise<{ user_id: number } | null> {
    return prisma.user.findUnique({
      where: { user_id: id },
      select: { user_id: true },
    });
  },

  async findUsersByRoleId(roleId: number): Promise<{ user_id: number; email: string; first_name: string | null; last_name: string | null }[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { role_id: roleId },
      include: {
        user: {
          include: {
            profile: { select: { first_name: true, last_name: true } },
          },
        },
      },
    });

    return userRoles.map((ur) => ({
      user_id: ur.user.user_id,
      email: ur.user.email,
      first_name: ur.user.profile?.first_name ?? null,
      last_name: ur.user.profile?.last_name ?? null,
    }));
  },

  async findRolesByPermissionId(permissionId: number): Promise<{ role_id: number; name: string }[]> {
    const rolePermissions = await prisma.rolePermission.findMany({
      where: { permission_id: permissionId },
      include: { role: { select: { role_id: true, name: true } } },
    });

    return rolePermissions.map((rp) => rp.role);
  },

  async findUserRoles(userId: number): Promise<{ role_id: number; name: string }[]> {
    const userRoles = await prisma.userRole.findMany({
      where: { user_id: userId },
      include: { role: { select: { role_id: true, name: true } } },
    });

    return userRoles.map((ur) => ur.role);
  },

  async assignRoleToUser(userId: number, roleId: number): Promise<void> {
    await prisma.userRole.create({
      data: { user_id: userId, role_id: roleId },
    });
  },

  async removeRoleFromUser(userId: number, roleId: number): Promise<void> {
    await prisma.userRole.delete({
      where: { user_id_role_id: { user_id: userId, role_id: roleId } },
    });
  },

  async isUserAssignedToRole(userId: number, roleId: number): Promise<boolean> {
    const ur = await prisma.userRole.findUnique({
      where: { user_id_role_id: { user_id: userId, role_id: roleId } },
    });
    return ur !== null;
  },
};
