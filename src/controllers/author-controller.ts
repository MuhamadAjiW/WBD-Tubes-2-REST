import { Request, Response } from "express";
import { AuthorModel } from "../models/author-model";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { AuthRequest } from "../types/AuthRequest";

export class AuthorController{
    authorModel: AuthorModel;

    constructor(){
        this.authorModel = new AuthorModel();
    }

    // _TODO: Remove this
    index() {
        return async (req: Request, res: Response) => {
            res.send("Author controller gateway");
        }
    }

    createAuthor() {
        return async (req: Request, res: Response) => {
            return await this.authorModel.createAuthor(req, res);
        }
    }
    
    getAuthors () {
        return async (req: Request, res: Response) => {
            return await this.authorModel.getAuthors(req, res);
        }
    }

    getOneAuthor () {
        return async (req: Request, res: Response) => {
            console.log("Fetching one author");
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

    updateOneAuthor () {
        return async (req: Request, res: Response) => {
            return await this.authorModel.editAuthor(req, res);
        }
    }
    
    deleteOneAuthor () {
        return async (req: Request, res: Response) => {
            return await this.authorModel.deleteAuthorByID(req, res);
        }
    }

    getAuthorToken () {
        return async (req: Request, res: Response) => {
            return await this.authorModel.getAuthorToken(req, res);
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
    
    testErrorMw () {
        return async (req: Request, res: Response) => {
            throw Error();
        }
    }
}