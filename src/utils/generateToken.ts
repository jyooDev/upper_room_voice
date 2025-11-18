import { AccessToken } from "livekit-server-sdk";
import dotenv from "dotenv";

dotenv.config();

export function generateLivekitToken(roomName: string, identity: string) {
  const apiKey = process.env.LIVEKIT_API_KEY!;
  const apiSecret = process.env.LIVEKIT_API_SECRET!;

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
  });

  return at.toJwt();
}
