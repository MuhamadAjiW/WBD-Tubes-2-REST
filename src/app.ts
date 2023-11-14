import { Express, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { serverPort } from './config/server-config';
import { AuthorRoute } from './routes/author-route';
import { prismaClient } from './config/prisma-config';
import { redis } from './config/redis-config';
import { BookPRoute } from './routes/bookp-route';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from './middlewares/error-middleware';
import "express-async-errors"
import path from 'path';

require("express-async-errors")

export class App{
    server: Express;

    constructor() {
        const authorRoute = new AuthorRoute();
        const bookPRoute = new BookPRoute();

        prismaClient.$use(redis)
        
        console.log("Applying errormiddlewares");
        this.server = express();
        this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
        this.server.use(
        "/api",
        express.json(),
        express.urlencoded({ extended: true }),
        authorRoute.getRoutes(),
        bookPRoute.getRoutes(),
        notFoundErrorHandler,
        conflictErrorHandler,
        badRequestErrorHandler,
        unauthorizedErrorHandler,
        generalErrorHandler
        );
        this.server.get('/', (req: Request, res: Response) => {
            res.send(`Server setup at ${serverPort}`);
        });

        this.server.use('/static/images', express.static('resources/images'));
        this.server.use('/static/audios', express.static('resources/audios'));
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