import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { prismaClient } from '../config/prisma-config';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtExpireTime, jwtSecretKey } from '../config/jwt-config';
import { AuthorRequest } from '../types/AuthorRequest';
import { TokenRequest } from '../types/TokenRequest';
import { z } from 'zod';
import { AuthorUpdateRequest } from '../types/AuthorUpdateRequest';
import { AuthToken } from '../types/AuthToken';

export class AuthorModel {
    async getAuthors(req: Request, res: Response){
        // _TODO: Uncomment kalo udah bug free
        // try {
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
                data: user
            });
            console.log("Authors fetched");
            return;

        // _TODO: Uncomment kalo udah bug free
        // } catch (error) {
        //     if(notId){
        //         throw new Error();
        //     }
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //         error: ReasonPhrases.INTERNAL_SERVER_ERROR
        //     });
        //     return;
        // }
    }

    async createAuthor(req: Request, res: Response) {
        // _TODO: Uncomment kalo udah bug free
        // try {
            let authRequest: AuthorRequest;
            try {
                authRequest = req.body;
            } catch (error) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }
            
            const existingUserEmail = await prismaClient.author.findFirst({
                where: { email: authRequest.email }
            });
            if (existingUserEmail){
                res.status(StatusCodes.CONFLICT).json({
                    error: "Email is already taken"
                });
                return;
            }
    
            const existingUserUname = await prismaClient.author.findFirst({
                where: { username: authRequest.username }
            });
            if (existingUserUname){
                res.status(StatusCodes.CONFLICT).json({
                    error: "Username is already taken"
                });
                return;
            }
    
            authRequest.password = await hash(authRequest.password, 10);
            const newAuthor = await prismaClient.author.create({
                data: authRequest
            });
    
            if (!newAuthor){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: ReasonPhrases.INTERNAL_SERVER_ERROR
                });
                return;
            }
        
            res.status(StatusCodes.CREATED).json({
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

        // _TODO: Uncomment kalo udah bug free
        // } catch (error) {
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //         error: ReasonPhrases.INTERNAL_SERVER_ERROR
        //     });
        //     return;
        // }
    }

    async getAuthorByID(req: Request, res: Response){
        let notId: boolean = false;
        // _TODO: Uncomment kalo udah bug free
        // try {
            console.log("checking by ID");
            const id = req.params.identifier;
            if (!id){
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: ReasonPhrases.BAD_REQUEST,
                });
                return;
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
                res.status(StatusCodes.NOT_FOUND).json({
                    error: "User does not exist"
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                data: user
            });
            console.log("Author fetched");
            return;

        // _TODO: Uncomment kalo udah bug free
        // } catch (error) {
        //     if(notId){
        //         throw new Error();
        //     }
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //         error: ReasonPhrases.INTERNAL_SERVER_ERROR
        //     });
        //     return;
        // }
    }

    async getAuthorByUsername(req: Request, res: Response){
        // _TODO: Uncomment kalo udah bug free
        // try {
            console.log("checking by Username");
            const username = z.string().safeParse(req.params.identifier);
            if (!username.success){
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: username.error.message,
                });
                return;
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
                res.status(StatusCodes.NOT_FOUND).json({
                    error: "User does not exist"
                });
                return;
            }

            res.status(StatusCodes.OK).json({
                data: user
            });
            console.log("Author fetched");
            return;

        // _TODO: Uncomment kalo udah bug free
        // } catch (error) {
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //         error: ReasonPhrases.INTERNAL_SERVER_ERROR
        //     });
        //     return;
        // }
    }

    async deleteAuthorByID(req: Request, res: Response){
        let notId: boolean = false;
        // _TODO: Uncomment kalo udah bug free
        // try {
            console.log("checking by ID");
            const id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
            if (!id.success){
                console.error(req.params.identifier)
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: id.error.message,
                });
                return;
            }

            try {
                const user = await prismaClient.author.delete({
                    where: { author_id: id.data }                
                });
    
                res.status(StatusCodes.OK).json({
                    data: user
                });
                return;
            } catch (error) {
                res.status(StatusCodes.NOT_FOUND).json({
                    error: "User does not exist"
                });
                console.log("Author deleted");
                return;
            }

        // _TODO: Uncomment kalo udah bug free
        // } catch (error) {
        //     if(notId){
        //         throw new Error();
        //     }
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //         error: ReasonPhrases.INTERNAL_SERVER_ERROR
        //     });
        //     return;
        // }
    }

    async editAuthor(req: Request, res: Response) {
        // _TODO: Uncomment kalo udah bug free
        // try {
            const author_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
            if(!author_id.success){
                res.status(StatusCodes.NOT_FOUND).json({
                    error: author_id.error.message,
                });
                return;
            }

            const currentUser = await prismaClient.author.findFirst({
                where: { author_id: author_id.data }
            });
            if (!currentUser){
                res.status(StatusCodes.NOT_FOUND).json({
                    error: "User does not exist"
                });
                return;
            }
            
            const authRequest = AuthorUpdateRequest.safeParse(req.body);
            if(!authRequest.success){
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: authRequest.error.message,
                });
                return;
            }
            const requestData: AuthorUpdateRequest = authRequest.data;

            if(requestData.email && requestData.email != currentUser.email){
                const existingUserEmail = await prismaClient.author.findFirst({
                    where: { email: requestData.email }
                });
                if (existingUserEmail){
                    res.status(StatusCodes.CONFLICT).json({
                        error: "Email is already taken"
                    });
                    return;
                }
            }
            if(requestData.username && requestData.username != currentUser.username){
                const existingUserUname = await prismaClient.author.findFirst({
                    where: { username: requestData.username },
                });
                if (existingUserUname){
                    res.status(StatusCodes.CONFLICT).json({
                        error: "Username is already taken"
                    });
                    return;
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
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: ReasonPhrases.INTERNAL_SERVER_ERROR
                });
                return;
            }
        
            res.status(StatusCodes.CREATED).json({
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

        // _TODO: Uncomment kalo udah bug free
        // } catch (error) {
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //         error: ReasonPhrases.INTERNAL_SERVER_ERROR
        //     });
        //     return;
        // }
    }

    async getAuthorToken(req: Request, res: Response) {
        // _TODO: Uncomment kalo udah bug free
        // try {
            const { email, password }: TokenRequest = req.body;
            if (!email || !password){
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const author = await prismaClient.author.findFirst({
                where: { email: email },
            })

            if(!author){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    error: "Invalid credentials",
                });
                return;
            }

            const passOk = await compare(password, author.password);
            if(!passOk){
                res.status(StatusCodes.UNAUTHORIZED).json({
                    error: "Invalid credentials",
                });
                return;
            }

            const author_id = author.author_id;
            const tokenInfo: AuthToken = { author_id };
            const token = jwt.sign(tokenInfo, jwtSecretKey, {
                expiresIn: jwtExpireTime
            })

            res.status(StatusCodes.OK).json({
                data: token
            })
        // _TODO: Uncomment kalo udah bug free
        // } catch (error) {
        //     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        //         error: ReasonPhrases.INTERNAL_SERVER_ERROR
        //     });
        //     return;
        // }
    }
}