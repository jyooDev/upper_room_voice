import { Request, Response, NextFunction } from "express";
import { RoomServiceClient } from "livekit-server-sdk";

import { generateLivekitToken } from "../utils/generateToken";
import config from "../config/config";
import Logger from "../utils/logger";

const logger = new Logger("controllers/room.controller");

function getAuthHeader(req: Request): string | undefined {
  const auth = req.headers.authorization;
  return typeof auth === "string" ? auth : undefined;
}

async function backendRequest<T>(
  req: Request,
  path: string,
  options: { method: "GET" | "POST"; body?: any } = { method: "GET" },
): Promise<{ ok: boolean; status: number; data?: T; error?: any }> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  const auth = getAuthHeader(req);
  if (auth) headers["Authorization"] = auth;

  const res = await fetch(`${config.backendUrl}${path}`, {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  let data: any = undefined;
  try {
    data = await res.json();
  } catch {
    // ignore
  }

  return {
    ok: res.ok,
    status: res.status,
    data,
    error: res.ok ? undefined : data,
  };
}

/** Deterministic room name; matches backend sermon.roomName */
function roomNameForSermon(sermonId: string): string {
  return `sermon-${sermonId}`;
}

class RoomController {
  /**
   * POST /voice-api/v1/rooms/start-room
   * Backend enforces organizer/pastor/manager and creates a live session record.
   */
  async startRoom(req: Request, res: Response, next: NextFunction) {
    const { sermonId } = req.body as { sermonId?: string };
    const user = req.user as { uid?: string } | undefined;

    if (!sermonId) return res.status(400).json({ message: "sermonId is required" });
    if (!user?.uid) return res.status(403).json({ message: "forbidden" });

    try {
      const backend = await backendRequest<{ roomName?: string }>(
        req,
        "/api/v1/live-sessions/start",
        { method: "POST", body: { sermonId } },
      );

      if (!backend.ok) {
        return res.status(backend.status).json(backend.error ?? { message: "failed" });
      }

      const roomName = backend.data?.roomName ?? roomNameForSermon(sermonId);
      const token = await generateLivekitToken({
        roomName,
        identity: user.uid,
        canPublish: true,
        canSubscribe: true,
      });

      return res.json({ roomName, token, livekitUrl: config.livekitUri });
    } catch (err) {
      logger.error("start-room error:", err);
      return res.status(500).json({ message: "failed to get join info" });
    }
  }

  /**
   * POST /voice-api/v1/rooms/join-room (alias: /join)
   * Backend enforces org membership and LIVE status.
   */
  async joinRoom(req: Request, res: Response, next: NextFunction) {
    const { sermonId } = req.body as { sermonId?: string };
    const user = req.user as { uid?: string } | undefined;

    if (!sermonId) return res.status(400).json({ message: "sermonId is required" });
    if (!user?.uid) return res.status(403).json({ message: "forbidden" });

    try {
      const backend = await backendRequest<{ roomName?: string }>(
        req,
        "/api/v1/live-sessions/join",
        { method: "POST", body: { sermonId } },
      );

      if (!backend.ok) {
        return res.status(backend.status).json(backend.error ?? { message: "failed" });
      }

      const roomName = backend.data?.roomName ?? roomNameForSermon(sermonId);
      const token = await generateLivekitToken({
        roomName,
        identity: user.uid,
        canPublish: false,
        canSubscribe: true,
      });

      return res.json({ roomName, token, livekitUrl: config.livekitUri });
    } catch (err) {
      logger.error("join-room error:", err);
      return res.status(500).json({ message: "failed to get join info" });
    }
  }

  /**
   * POST /voice-api/v1/rooms/end-room
   * Organizer-only enforced by backend.
   * Also attempts to delete the LiveKit room (best-effort) to disconnect clients.
   */
  async endRoom(req: Request, res: Response, next: NextFunction) {
    const { sermonId, storeRecording } = req.body as {
      sermonId?: string;
      storeRecording?: boolean;
    };
    const user = req.user as { uid?: string } | undefined;

    if (!sermonId) return res.status(400).json({ message: "sermonId is required" });
    if (!user?.uid) return res.status(403).json({ message: "forbidden" });

    try {
      const backend = await backendRequest<any>(req, "/api/v1/live-sessions/end", {
        method: "POST",
        body: { sermonId, storeRecording: !!storeRecording },
      });

      if (!backend.ok) {
        return res.status(backend.status).json(backend.error ?? { message: "failed" });
      }

      const roomName = roomNameForSermon(sermonId);
      try {
        const client = new RoomServiceClient(
          config.livekitHttpUrl,
          config.livekitApikey,
          config.livekitSecret,
        );
        await client.deleteRoom(roomName);
      } catch (err) {
        logger.warn("Failed to delete LiveKit room (best-effort):", err);
      }

      return res.status(200).json({ ok: true });
    } catch (err) {
      logger.error("end-room error:", err);
      return res.status(500).json({ message: "failed to end room" });
    }
  }
}

export default RoomController;
