import { Request } from "express";
import { AuthToken } from "./AuthToken";

export interface AuthRequest extends Request {
    authToken?: AuthToken;
}