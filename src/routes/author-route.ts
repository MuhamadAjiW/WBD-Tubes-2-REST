import { Request, Response, Router } from "express";
import { AuthorController } from "../controllers/author-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { SOAPController } from "../controllers/soap-controller";

export class AuthorRoute{
    authorController: AuthorController;
    soapController: SOAPController
    authMiddleware: AuthMiddleware;

    constructor() {
        this.authorController = new AuthorController();
        this.soapController = new SOAPController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return Router()
            .post("/token",
                this.authorController.getAuthorToken())
            .get('/token/check', 
                this.authMiddleware.authenticate(),
                this.authorController.checkToken())
        
            // _TODO: Remove these
            .get('/authors/gateway', 
                this.authorController.index())
            .get('/authors/errorgateway', 
                this.authorController.testErrorMw())
            .get("/soap/test",
                this.soapController.test())

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