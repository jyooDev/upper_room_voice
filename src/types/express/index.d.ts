import type admin from "firebase-admin";
import type { AppUser } from "../auth/user";

declare global {
  namespace Express {
    interface Request {
      user?: AppUser;
    }
  }
}

export {};
