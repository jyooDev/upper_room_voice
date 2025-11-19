import dotenv from "dotenv";

dotenv.config();

interface IConfig {
  port: number;
  nodeEnv: string;
  livekitApikey: string;
  livekitSecret: string;
  livekitUri: string;
  voiceServerIdentity: string;
}

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
  livekitUri:
    (process.env.LIVEKIT_ENV === "development"
      ? process.env.DEV_LIVEKIT_URI
      : process.env.PROD_LIVEKIT_URI) || "",
  voiceServerIdentity: process.env.VOICE_SERVER_IDENTITY || "voice-server",
};

export default config;
