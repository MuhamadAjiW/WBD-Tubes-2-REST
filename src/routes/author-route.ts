import { Request, Response, Router } from "express";
import { AuthorController } from "../controllers/author-controller";

export class AuthorRoute{
    authorController: AuthorController;

    constructor() {
        this.authorController = new AuthorController();
    }

    getRoutes() {
        return Router()
            .get('/authors', this.authorController.index())
            .post("/authors/register", this.authorController.register())
            .post("/authors/login", this.authorController.login())
    }
}