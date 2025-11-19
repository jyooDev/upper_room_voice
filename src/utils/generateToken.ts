import { AccessToken } from "livekit-server-sdk";
import config from "../config/config";

export function generateLivekitToken(roomName: string, identity: string) {
  const apiKey = config.livekitApikey;
  const apiSecret = config.livekitSecret;

  const at = new AccessToken(apiKey, apiSecret, {
    identity,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
  });

  return at.toJwt();
}
