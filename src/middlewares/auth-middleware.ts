import { NextFunction, Request, Response } from "express";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken"
import { jwtSecretKey } from "../config/jwt-config";

export interface AuthToken {
    author_id: number;
}

export interface AuthRequest extends Request {
    authToken?: AuthToken;
}

export class AuthMiddleware {
    authenticate() {
        return async (req: Request, res: Response, func: NextFunction) => {
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

                func();
            } catch (error) {
                res.status(StatusCodes.UNAUTHORIZED).json({
                    error: ReasonPhrases.UNAUTHORIZED,
                });
                return;
            }

        }
    }
}