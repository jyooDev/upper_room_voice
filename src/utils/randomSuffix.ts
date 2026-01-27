import crypto from "crypto";

export function randomSuffix(length = 6) {
  return crypto.randomBytes(length).toString("base64url").slice(0, length);
}
