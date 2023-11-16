import { Router } from "express";
import { BookPController } from "../controllers/bookp-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthTypes } from "../types/enums/AuthTypes";

export class BookPRoute {
    bookPController: BookPController;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.bookPController = new BookPController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return Router()
            .get('/books',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.bookPController.getBooks())
            .post('/books',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.bookPController.createBookP())
            .get('/books/:identifier',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.bookPController.getBookPByID())
            .delete('/books/:identifier',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.bookPController.deleteOneBookP())
            .patch('/books/:identifier',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.bookPController.updateOneBook())

            .get('/authors/:identifier/books',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.bookPController.getBookPByAuthor())
    }
}