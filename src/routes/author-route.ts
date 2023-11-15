import { Request, Response, Router } from "express";
import { AuthorController } from "../controllers/author-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthTypes } from "../types/enums/AuthTypes";
import { SubscriberController } from "../controllers/subscriber-controller";

export class AuthorRoute{
    authorController: AuthorController;
    subscriberController: SubscriberController;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.authorController = new AuthorController();
        this.subscriberController = new SubscriberController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return Router()
            // _TODO: Remove these
            .get('/authors/gateway', 
                this.authorController.index())
            .get('/authors/errorgateway', 
                this.authorController.testErrorMw())
                
            .post("/token",
                this.authorController.getAuthorToken())
            .get('/token/check', 
                // this.authMiddleware.authenticate(AuthTypes.USERONLY),
                this.authorController.checkToken())
            .get('/token/id', 
                // this.authMiddleware.authenticate(AuthTypes.USERONLY),
                this.authorController.getTokenID())

            .get('/authors', 
                // this.authMiddleware.authenticate(AuthTypes.INTERNALONLY),
                this.authorController.getAuthors())
            .post("/authors",
                this.authorController.createAuthor())
            .get('/authors/:identifier', 
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.authorController.getOneAuthor())
            .patch('/authors/:identifier',
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.authorController.updateOneAuthor())
            .delete('/authors/:identifier', 
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.authorController.deleteOneAuthor())

            .get('/authors/:identifier/subscribers', 
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.getSubscribersByAuthor())
            .get("/authors/:identifier/subscribers/requests",
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.getSubsRequestByAuthor())
            .get("/authors/:identifier/subscribers/requests/:user_identifier",
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.getSubsRequest())
            .patch("/authors/:identifier/subscribers/requests/:user_identifier",
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.updateSubscriber())
            .delete("/authors/:identifier/subscribers/requests/:user_identifier",
                // this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.deletaAuthorSubscriber())
    }
}