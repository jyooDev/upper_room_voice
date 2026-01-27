import { AccessToken } from "livekit-server-sdk";
import config from "../config/config";

interface LivekitTokenOptions {
  roomName: string;
  identity: string;
  canPublish?: boolean;
  canSubscribe?: boolean;
  ttl?: string;
}

export function generateLivekitToken({
  roomName,
  identity,
  canPublish = false,
  canSubscribe = true,
  ttl = "15m",
}: LivekitTokenOptions) {
  const at = new AccessToken(config.livekitApikey, config.livekitSecret, {
    identity,
  });

  at.addGrant({
    room: roomName,
    roomJoin: true,
    canPublish,
    canSubscribe,
  });

  at.ttl = ttl;

  return at.toJwt();
}
