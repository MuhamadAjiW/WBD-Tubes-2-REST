import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken"
import { UnauthorizedError } from "../types/errors/UnauthorizedError";
import { AuthRequest } from "../types/AuthRequest";
import { AuthToken } from "../types/AuthToken";
import { jwtSecretKey } from "../config/jwt-config";
import { AuthTypes } from "../types/enums/AuthTypes";
import { MOLI_TOKEN, SOAP_TOKEN } from "../config/server-config";

export class AuthMiddleware {
    private checkSOAPKey(req: Request, res: Response, next: NextFunction, token: string) {
        return token === SOAP_TOKEN;
    }

    private checkMonolithKey(req: Request, res: Response, next: NextFunction, token: string) {
        return token === MOLI_TOKEN;
    }

    private checkUserJWT(req: Request, res: Response, next: NextFunction, token: string): boolean{
        try {
            const decodedToken = jwt.verify(token, jwtSecretKey) as AuthToken;
            (req as AuthRequest).authToken = decodedToken;
            return true;
        } catch (error) {
            return false;
        }
    }

    authenticate(authType: AuthTypes) {
        return async (req: Request, res: Response, next: NextFunction) => {
            const token = req
            .header("Authorization")
            ?.replace("Bearer ", "");
            if (!token){
                throw new UnauthorizedError("No token provided");
            }
            
            console.log("Checking authorizations")
            let success: boolean = false;

            switch (authType) {
                case AuthTypes.ANYAUTH:
                    success = this.checkMonolithKey(req, res, next, token) || this.checkSOAPKey(req, res, next, token) || this.checkUserJWT(req, res, next, token);
                    break;
                case AuthTypes.INTERNALONLY:
                    success = this.checkMonolithKey(req, res, next, token) || this.checkSOAPKey(req, res, next, token);
                    break;
                case AuthTypes.USERONLY:
                    success = this.checkUserJWT(req, res, next, token);
                    break;
                case AuthTypes.MONOLITHONLY:
                    success = this.checkMonolithKey(req, res, next, token);
                    break;
                case AuthTypes.SOAPONLY:
                    success = this.checkSOAPKey(req, res, next, token);
                    break;
                default:
                    throw new Error("Bad authentication checker");
            }

            if (success){
                next();
            }
            else{
                throw new UnauthorizedError("Bad token");
            }
        }
    }    
}