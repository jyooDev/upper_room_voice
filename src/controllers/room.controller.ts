import { Request, Response, NextFunction } from "express";
import { generateLivekitToken } from "../utils/generateToken";
import { randomSuffix } from "../utils/randomSuffix";
import { startLiveKit, getRoomBySermonId } from "../livekit";

class RoomController {
  // POST /voice-api/v1/rooms/start-room
  async startRoom(req: Request, res: Response, next: NextFunction) {
    const { sermonId } = req.body;
    const user = req.user;

    if (!sermonId) {
      return res.status(400).send({ message: "sermonId is required" });
    }

    if (user == null || (user.role !== "ORGANIZER" && user.role !== "HOST")) {
      return res.status(403).send({ message: "forbidden" });
    }

    try {
      const roomName = `sermon-${sermonId}-${randomSuffix()}`;
      const token = await generateLivekitToken({
        roomName,
        identity: user.uid,
        canPublish: false,
      });
      await startLiveKit(sermonId, token);

      return res.json({ message: `started room: ${roomName}-`, token: token });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "failed to start room" });
    }
  }

  // POST /voice-api/v1/rooms/join-room
  async joinRoom(req: Request, res: Response, next: NextFunction) {
    const { sermonId } = req.body;
    const user = req.user;

    if (!sermonId) {
      return res.status(400).send({ message: "sermonId is required" });
    }

    if (user == null) {
      return res.status(403).send({ message: "forbidden" });
    }

    try {
      const room = await getRoomBySermonId(sermonId);
      if (!room) {
        return res.status(404).send({ message: "room not found" });
      }

      const token = await generateLivekitToken({
        roomName: room.name,
        identity: user.uid,
        canPublish: false,
      });

      return res.json({ roomName: room.name, token: token });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "failed to join room" });
    }
  }
}

export default RoomController;
