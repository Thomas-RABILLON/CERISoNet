import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
    res.send("Hello World");
});

router.post('/auth/login/', (req, res) => {
    const { username, pwd } = req.body

    console.log('username : ' + username + ', password : ' + pwd)

    res.sendStatus(200)
});

export default router;