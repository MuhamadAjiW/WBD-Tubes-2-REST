import { Request, Response } from "express";
import { AuthorModel } from "../models/author-model";

export class AuthorController{
    authorModel: AuthorModel;

    constructor(){
        this.authorModel = new AuthorModel();
    }

    index() {
        return async (req: Request, res: Response) => {
            res.send("Author controller gateway");
        }
    }

    register() {
        return async (req: Request, res: Response) => {
            return this.authorModel.register(req, res);
        }
    }

    login () {
        return async (req: Request, res: Response) => {
            return this.authorModel.login(req, res);
        }
    }
}