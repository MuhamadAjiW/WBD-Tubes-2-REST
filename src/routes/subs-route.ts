import { Router } from "express";
import { SubscriberController } from "../controllers/subscriber-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthTypes } from "../types/enums/AuthTypes";

export class SubscribersRoute{
    subscriberController: SubscriberController;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.subscriberController = new SubscriberController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return Router()
            .get('/authors/:identifier/subscribers', 
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.getSubscribersByAuthor())
            .get("/authors/:identifier/subscribers/requests",
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.getSubsRequestByAuthor())
            .get("/authors/:identifier/subscribers/requests/:user_identifier",
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.getSubsRequest())
            .patch("/authors/:identifier/subscribers/requests/:user_identifier",
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.updateSubscriber())
            .delete("/authors/:identifier/subscribers/requests/:user_identifier",
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.subscriberController.deleteAuthorSubscriber())
    }
}