import { Express, Request, Response } from 'express';
import express from 'express';
import { serverPort } from './config/server-config';
import { AuthorRoute } from './routes/author-route';
import { prismaClient } from './config/prisma-config';
import { redis } from './config/redis-config';

export class App{
    server: Express;

    constructor() {
        const authorRoute = new AuthorRoute();

        prismaClient.$use(redis)
        
        this.server = express();
        this.server.use(
            "/api",
            express.json(),
            express.urlencoded({ extended: true }),
            authorRoute.getRoutes()
            )
            this.server.get('/', (req: Request, res: Response) => {
                res.send(`Server setup at ${serverPort}`);
            });
        }
        
    run () {
        process.on("uncaughtException", (error) =>{
            console.error("Server encountered an uncaught error: ", error);
            console.log("\n\nServer continues running");
        })

        this.server.listen(serverPort, () =>{
            console.log(`Server setup at ${serverPort}`);
        });
    }
}