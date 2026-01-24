import { Router } from "express";

const router = Router();

import roomRoutes from "./room.routes";

router.use("/rooms", roomRoutes);

export default router;
