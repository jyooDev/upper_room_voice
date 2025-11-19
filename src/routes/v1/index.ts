import { Router } from "express";

const router = Router();

import roomRoutes from "./room.routes";

router.use("/room", roomRoutes);

export default router;
