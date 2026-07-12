export interface UserPayload {
  userId: number;
  email: string;
  roles: string[];
}

export interface RefreshPayload {
  userId: number;
  email: string;
}

export interface LoginData {
  accessToken: string;
  refreshToken: string;
  user: {
    user_id: number;
    email: string;
    status: string;
    roles: string[];
  };
}

export interface RegisterData extends LoginData {
  user: LoginData["user"] & {
    first_name: string;
    last_name: string;
  };
}
