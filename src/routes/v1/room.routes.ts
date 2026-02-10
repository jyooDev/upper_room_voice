import { Router } from "express";
import { RoomController } from "../../controllers";
const router = Router();

const roomController = new RoomController();

router.post("/start-room", roomController.startRoom.bind(roomController));

router.post("/join", roomController.joinRoom.bind(roomController));

export default router;
