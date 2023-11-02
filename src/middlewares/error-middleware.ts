import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export class ErrorMiddleware{
    check() {
        return async (err: Error, req: Request, res: Response) =>{
            console.log("Error caught by middleware");
    
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: ReasonPhrases.INTERNAL_SERVER_ERROR,
            });
        }
    }
  }