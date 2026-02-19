import dotenv from "dotenv";

dotenv.config();

interface IConfig {
  port: number;
  nodeEnv: string;

  livekitApikey: string;
  livekitSecret: string;
  /** WebSocket URL used by clients to connect (ws/wss). */
  livekitUri: string;
  /** HTTP(S) URL used by LiveKit server API (RoomServiceClient). */
  livekitHttpUrl: string;

  voiceServerIdentity: string;
  backendUrl: string;
}

function deriveHttpUrlFromWs(wsUrl: string): string {
  if (!wsUrl) return "";
  if (wsUrl.startsWith("wss://")) return wsUrl.replace(/^wss:\/\//, "https://");
  if (wsUrl.startsWith("ws://")) return wsUrl.replace(/^ws:\/\//, "http://");
  return wsUrl;
}

const livekitUri =
  (process.env.LIVEKIT_ENV === "development"
    ? process.env.DEV_LIVEKIT_URL
    : process.env.PROD_LIVEKIT_URL) || "";

const config: IConfig = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",

  livekitApikey:
    (process.env.LIVEKIT_ENV === "development"
      ? process.env.DEV_LIVEKIT_API_KEY
      : process.env.PROD_LIVEKIT_API_KEY) || "devkey",
  livekitSecret:
    (process.env.LIVEKIT_ENV === "development"
      ? process.env.DEV_LIVEKIT_API_SECRET
      : process.env.PROD_LIVEKIT_API_SECRET) || "secret",

  livekitUri,
  livekitHttpUrl:
    (process.env.LIVEKIT_ENV === "development"
      ? process.env.DEV_LIVEKIT_HTTP_URL
      : process.env.PROD_LIVEKIT_HTTP_URL) || deriveHttpUrlFromWs(livekitUri),

  voiceServerIdentity: process.env.VOICE_SERVER_IDENTITY || "voice-server",
  backendUrl: process.env.BACKEND_URL || "http://localhost:8888",
};

export default config;
