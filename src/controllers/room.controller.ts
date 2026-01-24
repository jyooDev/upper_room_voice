import { Request, Response, NextFunction } from "express";
import { generateLivekitToken } from "../utils/generateToken";
import config from "../config/config";
import { startLiveKit } from "../livekit/connect";

class RoomController {
  // POST /voice-api/v1/room/start-room
  async startRoom(req: Request, res: Response, next: NextFunction) {
    const { roomName } = req.body;

    if (!roomName) {
      return res.status(400).send({ message: "roomName is required" });
    }

    try {
      const token = await generateLivekitToken(
        roomName,
        config.voiceServerIdentity,
      );
      await startLiveKit(roomName, token);

      return res.json({ message: `started room: ${roomName}`, token: token });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "failed to start room" });
    }
  }


  // POST /voice-api/v1/room/join-room
  async joinRoom(req: Request, res: Response, next: NextFunction) {
    const { roomName, identity } = req.body;

    if (!roomName || !identity) {
      return res
        .status(400)
        .send({ message: "roomName and identity are required" });
    }

    try {
      const token = await generateLivekitToken(roomName, identity);

      return res.json({ message: `joined room: ${roomName}`, token: token });
    } catch (err) {
      console.error(err);
      return res.status(500).send({ message: "failed to join room" });
    }
}

export default RoomController;
