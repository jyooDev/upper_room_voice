import { Router } from "express";
import { RoomController } from "../../controllers";
const router = Router();

const roomController = new RoomController();

router.post("/join-room", roomController.joinRoom);

export default router;
