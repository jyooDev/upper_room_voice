import { Request, Response, NextFunction } from "express";
import { generateLivekitToken } from "../utils/generateToken";
import config from "../config/config";
import { startLiveKit } from "../livekit/connect";

class RoomController {
  // POST /voice-api/v1/room/join
  async joinRoom(req: Request, res: Response, next: NextFunction) {
    const { roomName } = req.body;

    if (!roomName) {
      return res.status(400).send({ message: "roomName is required" });
    }

    try {
      const token = await generateLivekitToken(
        roomName,
        config.voiceServerIdentity
      );
      await startLiveKit(roomName, token);

      return res.json({ message: `Joined room: ${roomName}` });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "failed to join room" });
    }
  }
}

export default RoomController;
