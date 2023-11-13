import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

export const generalError = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.log(err.name);
    console.log(err.message);
    console.log("Error caught by middleware");
    res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR,
    });
    res.send();
}