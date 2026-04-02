import { Router } from "express";
import authRouter from "./auth/route";
import postsRouter from "./posts/route";
import usersRouter from "./users/route";

const router = Router();

router.use('/', authRouter);
router.use('/', postsRouter);
router.use('/', usersRouter);

export default router;