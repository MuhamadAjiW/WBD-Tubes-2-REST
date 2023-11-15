import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import { UnauthorizedError } from "../types/errors/UnauthorizedError";
import { NotFoundError } from "../types/errors/NotFoundError";
import { BadRequestError } from "../types/errors/BadRequestError";
import { ConflictError } from "../types/errors/ConflictError";

export const generalErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.stack);
    console.log("General error caught by middleware: ", err.message);
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        message: ReasonPhrases.INTERNAL_SERVER_ERROR,
        valid: false,
    });
    res.send();
    return;
}

export const unauthorizedErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof UnauthorizedError){        
        console.log("Unauthorized error caught by middleware: ", err.message);
        res.status(StatusCodes.UNAUTHORIZED).json({
            message: err.message,
            valid: false,
        });
        res.send();
        return;
    } else{
        throw err;
    }
}

export const notFoundErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof NotFoundError){        
        console.log("Not Found error caught by middleware: ", err.message);
        res.status(StatusCodes.NOT_FOUND).json({
            message: err.message,
            valid: false,
        });
        res.send();
        return;
    } else{
        throw err;
    }
}

export const badRequestErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof BadRequestError){        
        console.log("Bad request caught by middleware: ", err.message);
        res.status(StatusCodes.BAD_REQUEST).json({
            message: err.message,
            valid: false,
        });
        res.send();
        return;
    } else{
        throw err;
    }
}

export const conflictErrorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    if(err instanceof ConflictError){        
        console.log("Conflict caught by middleware: ", err.message);
        res.status(StatusCodes.CONFLICT).json({
            message: err.message,
            valid: false,
        });
        res.send();
        return;
    } else{
        throw err;
    }
}