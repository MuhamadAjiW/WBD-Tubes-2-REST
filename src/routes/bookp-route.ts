import { Request, Response, Router } from "express";
import { BookPController } from "../controllers/bookp-controller";

export class BookPRoute {
    bookPController: BookPController;

    constructor() {
        this.bookPController = new BookPController();
    }

    getRoutes() {
        return Router()

            .get('/books',
                this.bookPController.getBooks())
            .post('/books',
                this.bookPController.createBookP())
            .get('/books/:identifier', 
                this.bookPController.getBookPByID())
            .delete('/books/:identifier',
                this.bookPController.deleteOneBookP())
    }
}