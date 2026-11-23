export interface LoginInput {
  username: string;
  password: string;
}

export interface Admin {
  id: number;
  username: string;
}

export interface LoginResponse {
  message: string;
  token: string;
  admin: Admin;
}