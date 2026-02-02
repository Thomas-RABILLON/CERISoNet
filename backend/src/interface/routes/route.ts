import { Router } from "express";
import authRoute from "./auth/route";

const router = Router();

router.use('/auth', authRoute);

router.get("/", (req, res) => {
    res.send("Hello World");
});

export default router;