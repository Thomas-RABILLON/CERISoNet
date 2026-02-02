import { Router } from "express";

const authRoute = Router();

authRoute.post('/login/', (req, res) => {
    const data: {username: string, pwd: string} = req.body

    const username = data.username
    const pwd = data.pwd

    console.log('username : ' + username + ', password : ' + pwd)

    res.send(200)
});

export default authRoute;