import { Express, Request, Response } from 'express';
import express from 'express';
import cors from 'cors';
import { SERVER_PORT } from './config/server-config';
import { AuthorRoute } from './routes/author-route';
import { prismaClient } from './config/prisma-config';
import { redis } from './config/redis-config';
import { BookPRoute } from './routes/bookp-route';
import { PlaylistRoute } from './routes/playlist-route';
import { badRequestErrorHandler, conflictErrorHandler, generalErrorHandler, notFoundErrorHandler, unauthorizedErrorHandler } from './middlewares/error-middleware';
import "express-async-errors"
import bodyParser from 'body-parser';
import { SubscribersRoute } from './routes/subs-route';

require("express-async-errors")

export class App{
    server: Express;

    constructor() {
        const authorRoute = new AuthorRoute();
        const bookPRoute = new BookPRoute();
        const playlistRoute = new PlaylistRoute();
        const subsRoute = new SubscribersRoute();

        prismaClient.$use(redis)
        
        console.log("Applying errormiddlewares");
        this.server = express();
        this.server.use(bodyParser.json({ limit: '10mb' })); // Adjust the limit as needed
        this.server.use((cors as (options: cors.CorsOptions) => express.RequestHandler)({}));
        this.server.use(
        "/api",
        express.json(),
        express.urlencoded({ extended: true }),
        authorRoute.getRoutes(),
        bookPRoute.getRoutes(),
        playlistRoute.getRoutes(),
        subsRoute.getRoutes(),
        notFoundErrorHandler,
        conflictErrorHandler,
        badRequestErrorHandler,
        unauthorizedErrorHandler,
        generalErrorHandler
        );
        this.server.get('/', (req: Request, res: Response) => {
            res.send(`Server setup at ${SERVER_PORT}`);
        });

        this.server.use('/static/images', express.static('static/images'));
        this.server.use('/static/audios', express.static('static/audios'));
    }
        
    run () {
        process.on("uncaughtException", (error) =>{
            console.error("Server encountered an uncaught error: ", error);
            console.log("\n\nServer continues running");
        })

        this.server.listen(SERVER_PORT, () =>{
            console.log(`Server setup at ${SERVER_PORT}`);
        });
    }
}