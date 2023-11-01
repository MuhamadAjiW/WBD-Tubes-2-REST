import { Request, Response } from "express";
import { AuthorModel } from "../models/author-model";
import { AuthRequest } from "../middlewares/auth-middleware";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

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
            return await this.authorModel.register(req, res);
        }
    }

    login () {
        return async (req: Request, res: Response) => {
            return await this.authorModel.login(req, res);
        }
    }

    getAuthor () {
        return async (req: Request, res: Response) => {
            console.log("Fetching author");
            let retval;
            try {
                retval = await this.authorModel.getAuthorByID(req, res);
            } catch (error) {
                console.log("Requested url is not an ID");
                retval = await this.authorModel.getAuthorByUsername(req, res);
            }
            console.log("Done");
            return retval;
        }
    }

    checkToken () {
        return async (req: Request, res: Response) => {
            const { authToken } = req as AuthRequest;
            if (!authToken){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    error: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                data: authToken
            })
        }
    }
}