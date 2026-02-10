import { Request, Response, NextFunction } from "express";
import { generateLivekitToken } from "../utils/generateToken";
import config from "../config/config";
import Logger from "../utils/logger";

const logger = new Logger("controllers/room.controller");

/** Deterministic room name; matches backend sermon.roomName */
function roomNameForSermon(sermonId: string): string {
  return `sermon-${sermonId}`;
}

/**
 * Verify sermon exists and is LIVE by calling backend.
 * Voice API does not store sermon state; backend is the authority.
 */
async function isSermonLive(sermonId: string): Promise<boolean> {
  try {
    const url = `${config.backendUrl}/api/v1/sermons/${sermonId}`;
    const res = await fetch(url);
    if (!res.ok) return false;
    const data = (await res.json()) as { sermon?: { status?: string } };
    return data.sermon?.status === "LIVE";
  } catch (err) {
    logger.error("Failed to verify sermon with backend:", err);
    return false;
  }
}

class RoomController {
  /**
   * POST /voice-api/v1/rooms/start-room
   * Get LiveKit join info for the host who just created a sermon.
   * Room is created only when the client connects; we only issue a token.
   */
  async startRoom(req: Request, res: Response, next: NextFunction) {
    const { sermonId } = req.body;
    const user = req.user;

    if (!sermonId) {
      return res.status(400).json({ message: "sermonId is required" });
    }
    if (!user) {
      return res.status(403).json({ message: "forbidden" });
    }

    try {
      const roomName = roomNameForSermon(sermonId);
      const token = generateLivekitToken({
        roomName,
        identity: user.uid,
        canPublish: true,
        canSubscribe: true,
      });

      logger.debug("Join info for host:", { roomName, identity: user.uid });

      return res.json({
        roomName,
        token,
        livekitUrl: config.livekitUri,
      });
    } catch (err) {
      logger.error("start-room error:", err);
      return res.status(500).json({ message: "failed to get join info" });
    }
  }

  /**
   * POST /voice-api/v1/rooms/join
   * Get LiveKit join info for a listener/participant.
   * Confirms sermon is LIVE via backend; room name is deterministic.
   */
  async joinRoom(req: Request, res: Response, next: NextFunction) {
    const { sermonId } = req.body;
    const user = req.user;

    if (!sermonId) {
      return res.status(400).json({ message: "sermonId is required" });
    }
    if (!user) {
      return res.status(403).json({ message: "forbidden" });
    }

    try {
      const live = await isSermonLive(sermonId);
      if (!live) {
        return res.status(404).json({ message: "sermon not found or not live" });
      }

      const roomName = roomNameForSermon(sermonId);
      const token = generateLivekitToken({
        roomName,
        identity: user.uid,
        canPublish: false,
        canSubscribe: true,
      });

      logger.debug("Join info for participant:", { roomName, identity: user.uid });

      return res.json({
        roomName,
        token,
        livekitUrl: config.livekitUri,
      });
    } catch (err) {
      logger.error("join error:", err);
      return res.status(500).json({ message: "failed to get join info" });
    }
  }
}

export default RoomController;
