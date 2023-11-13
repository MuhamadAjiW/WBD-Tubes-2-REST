import { Request, Response, Router } from "express";
import { AuthorController } from "../controllers/author-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { SOAPController } from "../controllers/soap-controller";
import { AuthTypes } from "../types/enums/AuthTypes";

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
                this.authMiddleware.authenticate(AuthTypes.USERONLY),
                this.authorController.checkToken())
            .get('/token/id', 
                this.authMiddleware.authenticate(AuthTypes.USERONLY),
                this.authorController.getTokenID())
        
            // _TODO: Remove these
            .get('/authors/gateway', 
                this.authorController.index())
            .get('/authors/errorgateway', 
                this.authorController.testErrorMw())
            .get("/soap/test",
                this.soapController.test())

            .get('/authors', 
                this.authMiddleware.authenticate(AuthTypes.INTERNALONLY),
                this.authorController.getAuthors())
            .post("/authors",
                this.authorController.createAuthor())
            .get('/authors/:identifier', 
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.authorController.getOneAuthor())
            .patch('/authors/:identifier',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.authorController.updateOneAuthor())
            .delete('/authors/:identifier', 
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.authorController.deleteOneAuthor())  
    }
}