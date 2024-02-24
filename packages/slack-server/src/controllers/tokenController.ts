import jwt from "jsonwebtoken";

import { JWT_SECRET } from "@/utils/env";

export type UserToken = {
  id: string;
  password: string;
};

const JWT_EXPIRE = "1d";

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as UserToken;
  } catch {
    throw new Error("Token expired or invalid");
  }
}

export function createToken(id: string, password: string) {
  try {
    const newUserToken: UserToken = { id, password };
    return jwt.sign(newUserToken, JWT_SECRET, { expiresIn: JWT_EXPIRE });
  } catch {
    throw new Error("Token create error");
  }
}
