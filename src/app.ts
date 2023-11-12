import { Express, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { serverPort } from './config/server-config';
import { AuthorRoute } from './routes/author-route';
import { prismaClient } from './config/prisma-config';
import { redis } from './config/redis-config';
import { BookPRoute } from './routes/bookp-route';

export class App{
    server: Express;

    constructor() {
        const authorRoute = new AuthorRoute();
        const bookPRoute = new BookPRoute();

        prismaClient.$use(redis)
        
        this.server = express();
        this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
        this.server.use(
            "/api",
            express.json(),
            express.urlencoded({ extended: true }),
            authorRoute.getRoutes(),
            bookPRoute.getRoutes()
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