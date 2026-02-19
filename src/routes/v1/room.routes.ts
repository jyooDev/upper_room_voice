import { Router } from "express";
import { RoomController } from "../../controllers";
const router = Router();

const roomController = new RoomController();

router.post("/start-room", roomController.startRoom.bind(roomController));

// keep /join for backwards compatibility
router.post("/join", roomController.joinRoom.bind(roomController));
router.post("/join-room", roomController.joinRoom.bind(roomController));

router.post("/end-room", roomController.endRoom.bind(roomController));

export default router;
