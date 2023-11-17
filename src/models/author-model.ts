import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../config/prisma-config';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtExpireTime, jwtSecretKey } from '../config/jwt-config';
import { AuthorRequest } from '../types/AuthorRequest';
import { TokenRequest } from '../types/TokenRequest';
import { z } from 'zod';
import { AuthorUpdateRequest } from '../types/AuthorUpdateRequest';
import { AuthToken } from '../types/AuthToken';
import { BadRequestError } from '../types/errors/BadRequestError';
import { UnauthorizedError } from '../types/errors/UnauthorizedError';
import { ConflictError } from '../types/errors/ConflictError';
import { NotFoundError } from '../types/errors/NotFoundError';
import { AuthRequest } from '../types/AuthRequest';
import { MonolithController } from '../controllers/monolith-controller';
import { MOLI_URL } from '../config/server-config';
import { STATUS_CODES } from 'http';

export class AuthorModel {
    monolithController: MonolithController;

    constructor() {
        this.monolithController = new MonolithController(MOLI_URL);
    }
    
    async getAuthors(req: Request, res: Response){
        // TODO: Paging?
        // const page = z.number().int();
        // const limit = z.number().int();

        const user = await prismaClient.author.findMany({
            select: {
                author_id: true,
                email: true,
                username: true,
                name: true,
                bio: true,
            }
        });

        res.status(StatusCodes.OK).json({
            message: "Author fetch successful",
            valid: true,
            data: user
        });
        console.log("Authors fetched");
        return;
    }

    async createAuthor(req: Request, res: Response) {
        let authRequest: AuthorRequest;
        try {
            authRequest = req.body;
        } catch (error) {
            throw new BadRequestError("Bad request parameters");
        }
        
        const existingUserEmail = await prismaClient.author.findFirst({
            where: { email: authRequest.email }
        });
        if (existingUserEmail){
            res.status(StatusCodes.CONFLICT).json({
                message: "Invalid request",
                valid: false,
                data: {
                    error: {
                        emailError: "Email has already been taken"
                    }   
                }
            });
            return;
        }

        const existingUserUname = await prismaClient.author.findFirst({
            where: { username: authRequest.username }
        });
        if (existingUserUname){
            res.status(StatusCodes.CONFLICT).json({
                message: "Invalid request",
                valid: false,
                data: {
                    error: {
                        usernameError: "Username has already been taken"
                    }   
                }
            });
            return;
        }
        
        let response;
        let invalid: boolean = false;
        try {
            response = await this.monolithController.sendRequest("/api/users/premium", JSON.stringify(authRequest));
        } catch (error) {
            response = error;
            invalid = true;
        }
        
        if(invalid){
            response = response.response.data;
        } else{
            response = response.data;
        }
        console.log("received data:", response);
        if (!response.valid){
            // TODO: fix error codes
            res.status(StatusCodes.BAD_REQUEST).json(response);
            return;
        }


        authRequest.password = await hash(authRequest.password, 10);
        const newAuthor = await prismaClient.author.create({
            data: authRequest
        });

        if (!newAuthor){
            throw new Error("Failed to create author");
        }
    
        res.status(StatusCodes.CREATED).json({
            message: "Author creation successful",
            valid: true,
            data: {
                author_id: newAuthor.author_id,
                email: newAuthor.email,
                username: newAuthor.username,
                name: newAuthor.name,
                bio: newAuthor.bio,
            }
        });
        console.log("Author created");
        return;
    }

    async getAuthorByID(req: Request, res: Response){
        let notId: boolean = false;
        const id = req.params.identifier;
        if (!id){
            throw new BadRequestError("No id provided");
        }

        const numberId = parseInt(id, 10);
        if (isNaN(numberId)){
            notId = true;
            throw new Error();
        }

        const user = await prismaClient.author.findFirst({
            where: { author_id: numberId },
            select: {
                author_id: true,
                email: true,
                username: true,
                name: true,
                bio: true,
            }
        });
        if (!user){
            throw new NotFoundError("User does not exist");
        }

        res.status(StatusCodes.OK).json({
            message: "Author fetch successful",
            valid: true,
            data: user
        });
        console.log("Author fetched");
        return;
    }

    async getAuthorByUsername(req: Request, res: Response){
        const username = z.string().safeParse(req.params.identifier);
        if (!username.success){
            throw new BadRequestError(username.error.message);
        }

        const user = await prismaClient.author.findFirst({
            where: { username: username.data },
            select: {
                author_id: true,
                email: true,
                username: true,
                name: true,
                bio: true,
            }
        });
        if (!user){
            throw new NotFoundError("User does not exist");
        }

        res.status(StatusCodes.OK).json({
            message: "Author fetch successful",
            valid: true,
            data: user
        });
        console.log("Author fetched");
        return;
    }

    async deleteAuthorByID(req: Request, res: Response){
        let notId: boolean = false;
        const id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if (!id.success){
            throw new BadRequestError(id.error.message);
        }

        const { authToken } = req as AuthRequest;
        if (authToken){
            if (authToken.author_id != id.data){
                throw new UnauthorizedError("Cannot delete other users");
            }    
        }

        try {
            const user = await prismaClient.author.delete({
                where: { author_id: id.data }                
            });

            res.status(StatusCodes.OK).json({
                message: "Author deletion successful",
                valid: true,
                data: user
            });
            return;
        } catch (error) {
            throw new NotFoundError("User does not exist");
        }
    }

    async editAuthor(req: Request, res: Response) {        
        const author_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if(!author_id.success){
            throw new BadRequestError(author_id.error.message);
        }

        const { authToken } = req as AuthRequest;
        if (authToken){
            if (authToken.author_id != author_id.data){
                throw new UnauthorizedError("Cannot update other users");
            }    
        }

        const currentUser = await prismaClient.author.findFirst({
            where: { author_id: author_id.data }
        });
        if (!currentUser){
            throw new NotFoundError("User does not exist");
        }
        
        const authRequest = AuthorUpdateRequest.safeParse(req.body);
        if(!authRequest.success){
            throw new BadRequestError(authRequest.error.message);
        }
        const requestData: AuthorUpdateRequest = authRequest.data;

        if(requestData.email && requestData.email != currentUser.email){
            const existingUserEmail = await prismaClient.author.findFirst({
                where: { email: requestData.email }
            });
            if (existingUserEmail){
                throw new ConflictError("Email has already been taken");
            }
        }
        if(requestData.username && requestData.username != currentUser.username){
            const existingUserUname = await prismaClient.author.findFirst({
                where: { username: requestData.username },
            });
            if (existingUserUname){
                throw new ConflictError("Username has already been taken");
            }
        }
        if(requestData.password){
            requestData.password = await hash(requestData.password, 10);
        } 

        const newAuthor = await prismaClient.author.update({
            where: { author_id: author_id.data},
            data: requestData
        });

        if (!newAuthor){
            throw new Error("Failed to update author");
        }
    
        res.status(StatusCodes.OK).json({
            message: "Author update successful",
            valid: true,
            data: {
                author_id: newAuthor.author_id,
                email: newAuthor.email,
                username: newAuthor.username,
                name: newAuthor.name,
                bio: newAuthor.bio,
            }
        });
        console.log("Author edited");
        return;
    }

    async getAuthorToken(req: Request, res: Response) {
        console.log(req.body);
        const { email, password }: TokenRequest = req.body;
        if (!email || !password){
            throw new BadRequestError("No email provided");
        }
        if (!password){
            throw new BadRequestError("No password provided");
        }

        const author = await prismaClient.author.findFirst({
            where: { email: email },
        })

        if(!author){
            throw new UnauthorizedError("Invalid credentials");
        }

        const passOk = await compare(password, author.password);
        if(!passOk){
            throw new UnauthorizedError("Invalid credentials");
        }

        const author_id = author.author_id;
        const tokenInfo: AuthToken = { author_id };
        const token = jwt.sign(tokenInfo, jwtSecretKey, {
            expiresIn: jwtExpireTime
        })

        res.status(StatusCodes.OK).json({
            message: "Token fetch successful",
            valid: true,
            data: token
        })
    }

    async decodeToken(req: Request, res: Response) {
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            throw new UnauthorizedError("No token provided");
        }

        const decoded = jwt.verify(token, jwtSecretKey) as {author: {author_id: number}}

        const author_id = decoded.author.author_id

        res.status(StatusCodes.OK).json({
            message: "Token decode successful",
            valid: true,
            data: { author_id },
        });
    }
}