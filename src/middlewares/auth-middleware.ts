import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import { jwtSecretKey } from "../config/jwt-config";
import { AuthToken } from "../types/AuthToken";
import { AuthRequest } from "../types/AuthRequest";

export class AuthMiddleware {
    authenticate() {
        return async (req: Request, res: Response, next: NextFunction) => {
            const token = req
                .header("Authorization")
                ?.replace("Bearer ", "");
            if (!token){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    error: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

            try {
                const decodedToken = jwt.verify(token, jwtSecretKey) as AuthToken;
                (req as AuthRequest).authToken = decodedToken;

                next();
            } catch (error) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    error: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

        }
    }
}