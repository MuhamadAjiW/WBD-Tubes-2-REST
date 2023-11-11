import { Request, Response, Router } from "express";
import { AuthorController } from "../controllers/author-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { ErrorMiddleware } from "../middlewares/error-middleware";

export class AuthorRoute{
    authorController: AuthorController;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.authorController = new AuthorController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return Router()
            .get("/token",
                this.authorController.getAuthorToken())
            .get('/token/check', 
                this.authMiddleware.authenticate(),
                this.authorController.checkToken())
        
            // _TODO: Remove these
            .get('/authors/gateway', 
                this.authorController.index())
            .get('/authors/errorgateway', 
                this.authorController.testErrorMw())

            .get('/authors', 
                this.authorController.getAuthors())
            .post("/authors", 
                this.authorController.createAuthor())
            .get('/authors/:identifier', 
                this.authorController.getOneAuthor())
            .patch('/authors/:identifier', 
                this.authorController.updateOneAuthor())
            .delete('/authors/:identifier', 
                this.authorController.deleteOneAuthor())
                
    }
}