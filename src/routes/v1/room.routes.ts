import { Router } from "express";
import { RoomController } from "../../controllers";
const router = Router();

const roomController = new RoomController();

router.post("/start-room", roomController.startRoom);

export default router;
