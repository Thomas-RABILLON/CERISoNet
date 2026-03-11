import { Router } from "express";
import LoginRouter from "./api/login/route";

const router = Router();

// router.get('/', (_, res) => res.sendFile(__dirname + '/index.html'));
router.get('/', (_, res) => res.sendFile('/home/thomas/Documents/AMS/CERISoNet/src/index.html'));

router.use('/api/auth', LoginRouter);

export default router;