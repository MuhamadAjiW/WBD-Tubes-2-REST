import { Request, Response, Router } from "express";
import { AuthorController } from "../controllers/author-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";

export class AuthorRoute{
    authorController: AuthorController;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.authorController = new AuthorController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return Router()
            .get('/authors', 
                this.authorController.index())
            .get('/authors/token/check', 
                this.authMiddleware.authenticate(),
                this.authorController.checkToken())
            .get('/authors/:identifier', 
                this.authorController.getAuthor())
            .post("/authors/register", 
                this.authorController.register())
            .post("/authors/login", 
                this.authorController.login())
    }
}