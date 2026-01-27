import { Router } from "express";
import { verifyToken } from "../../middlewares";
const router = Router();

import roomRoutes from "./room.routes";

router.use(verifyToken);

router.use("/rooms", roomRoutes);

export default router;
