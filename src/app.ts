import { Express, Request, Response } from 'express';
import express from 'express';
import { serverPort } from './config/server-config';
import { AuthorRoute } from './routes/author-route';
import { prismaClient } from './config/prisma-config';
import { redisMiddleware } from './middlewares/redis-middleware';

export class App{
    server: Express;

    constructor() {
        const authorRoute = new AuthorRoute();
        prismaClient.$use(redisMiddleware)

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
        this.server.listen(serverPort, () =>{
            console.log(`Server setup at ${serverPort}`);
        });
    }
}