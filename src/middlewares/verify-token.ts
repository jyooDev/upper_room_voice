import admin from "../firebaseAdmin";
import { Request, Response, NextFunction } from "express";
import Logger from "../utils/logger";

const logger = new Logger("middlewares/verify-token");

const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ error: "Missing or invalid Authorization header" });
  }

  const idToken = header.substring("Bearer ".length);

  try {
    const decoded = await admin.auth().verifyIdToken(idToken);
    req.user = {
      uid: decoded.uid,
      email: decoded.email,
      role: decoded.role || "GUEST",
      firstName: decoded.firstName || undefined,
      lastName: decoded.lastName || undefined,
    };
    logger.debug("Firebase ID token verified", { uid: decoded.uid });
    next();
  } catch (err) {
    logger.warn("Invalid Firebase ID token");
    return res.status(401).json({ error: "Unauthorized" });
  }
};

export default verifyToken;
