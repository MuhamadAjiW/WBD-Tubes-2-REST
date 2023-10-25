import { Express, Request, Response } from "express";
import express from 'express';

const app: Express = express();

app.get('/', (req: Request, res: Response) =>{
    res.send("Express is running at 4321");
})

app.listen(4321, () => {
    console.log("Express is running at 4321")
})