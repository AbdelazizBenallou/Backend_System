import prisma from "../../../framework/config/prisma.js";
import { hash } from "../../../framework/utils/hash.js";
import { jwtUtils, type AccessTokenPayload } from "../../../framework/utils/jwt.js";
import { AppError } from "../../../framework/utils/AppError.js";
import { userRepository } from "../users/user.repository.js";
import { roleRepository } from "./role.repository.js";
import { refreshTokenRepository } from "./refresh-token.repository.js";
import { loginHistoryRepository } from "./login-history.repository.js";
import type { LoginInput, RegisterInput } from "./auth.validator.js";
import type { LoginData, RegisterData } from "../../../framework/types/index.js";

const REFRESH_TOKEN_EXPIRES_IN_DAYS = 7;

function computeRefreshExpiry(): Date {
  return new Date(Date.now() + REFRESH_TOKEN_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000);
}

export const authService = {
  async login(data: LoginInput, ip: string, userAgent: string): Promise<LoginData> {
    const user = await userRepository.findAuthByEmail(data.email);

    if (!user || user.status !== "active") {
      throw new AppError("Invalid credentials", 401);
    }

    const isValid = await hash.verify(user.password_hash, data.password);

    if (!isValid) {
      throw new AppError("Invalid credentials", 401);
    }

    const tokenPayload: AccessTokenPayload = {
      userId: user.user_id,
      email: user.email,
      roles: user.roles,
    };

    const accessToken = jwtUtils.signAccessToken(tokenPayload);
    const refreshToken = jwtUtils.signRefreshToken({ userId: user.user_id, email: user.email });
    const tokenHash = await hash.token(refreshToken);

    await prisma.$transaction(async (tx) => {
      await refreshTokenRepository.create(user.user_id, tokenHash, computeRefreshExpiry(), tx);
      await loginHistoryRepository.create(user.user_id, ip, userAgent, tx);
    });

    return {
      accessToken,
      refreshToken,
      user: {
        user_id: user.user_id,
        email: user.email,
        status: user.status,
        roles: user.roles,
      },
    };
  },

  async register(data: RegisterInput, ip: string, userAgent: string): Promise<RegisterData> {
    const existingUser = await userRepository.findByEmail(data.email);

    if (existingUser) {
      throw new AppError("Email already exists", 409);
    }

    const passwordHash = await hash.password(data.password);

    const newUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          password_hash: passwordHash,
          status: "active",
        },
      });

      const defaultRole = await tx.role.findUnique({ where: { name: "Customer" } });
      if (!defaultRole) {
        throw new AppError("Default role not configured", 500);
      }

      await tx.userRole.create({
        data: { user_id: user.user_id, role_id: defaultRole.role_id },
      });

      await tx.profile.create({
        data: {
          user_id: user.user_id,
          first_name: data.first_name,
          last_name: data.last_name,
        },
      });

      return user;
    });

    const accessToken = jwtUtils.signAccessToken({
      userId: newUser.user_id,
      email: newUser.email,
      roles: ["Customer"],
    });

    const refreshToken = jwtUtils.signRefreshToken({
      userId: newUser.user_id,
      email: newUser.email,
    });

    const tokenHash = await hash.token(refreshToken);

    await prisma.$transaction(async (tx) => {
      await refreshTokenRepository.create(newUser.user_id, tokenHash, computeRefreshExpiry(), tx);
      await loginHistoryRepository.create(newUser.user_id, ip, userAgent, tx);
    });

    return {
      accessToken,
      refreshToken,
      user: {
        user_id: newUser.user_id,
        email: newUser.email,
        status: newUser.status,
        roles: ["Customer"],
        first_name: data.first_name,
        last_name: data.last_name,
      },
    };
  },

  async refreshAccessToken(userId: number): Promise<string> {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new AppError("User not found", 401);
    }

    if (user.status !== "active") {
      throw new AppError("Account is not active", 403);
    }

    const roles = await roleRepository.getRolesByUserId(userId);

    return jwtUtils.signAccessToken({
      userId: user.user_id,
      email: user.email,
      roles,
    });
  },
};
