import { Request, Response, NextFunction } from "express";
import { generateLivekitToken } from "../utils/generateToken";
import { randomSuffix } from "../utils/randomSuffix";
import config from "../config/config";
import { startLiveKit } from "../livekit/connect";
class RoomController {
  // POST /voice-api/v1/room/start-room
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
}

export default RoomController;
