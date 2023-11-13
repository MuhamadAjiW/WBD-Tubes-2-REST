import { Request, Response } from "express";
import { BookPModel } from "../models/bookp-model";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AuthRequest } from "../types/AuthRequest";

export class BookPController {
    bookpModel: BookPModel;

    constructor() {
        this.bookpModel = new BookPModel();
    }
    
    index() {
        return async (req: Request, res: Response) => {
            res.send("Book Premium controller gateway");
        }
    }

    createBookP() {
        return async (req: Request, res: Response) => {
            return await this.bookpModel.createBookP(req, res);
        }
    }

    getBooks() {
        return async (req: Request, res: Response) => {
            return await this.bookpModel.getBookPByAuthorID(req, res);
        }
    }

    getBookPByID() {
        return async (req: Request, res: Response) => {
            return await this.bookpModel.getBookPByID(req, res);
        }
    }

    getBookPByAuthor() {
        return async (req: Request, res: Response) => {
            return await this.bookpModel.getBookPByAuthorID(req, res);
        }
    }

    deleteOneBookP() {
        return async (req: Request, res: Response) => {
            return await this.bookpModel.deleteBookPByID(req, res);
        }
    }

    testErrorMw () {
        return async (req: Request, res: Response) => {
            throw Error();
        }
    }
}