import express, { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { prismaClient } from '../config/prisma-config';
import { hash } from 'bcrypt';

interface AuthorRequest {
    email: string;
    username: string;
    password: string;
    name: string;
    bio: string;
}

export class AuthorModel {
    async register(req: Request, res: Response) {
        // _TODO: Uncomment kalo udah bug free
        // try {
            const {email, username, password, name, bio}: AuthorRequest = req.body;
            if (!email || !username || !password || !name || !bio){
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }
            
            const existingUserEmail = await prismaClient.author.findFirst({
                where: { email: email }
            });
            if (existingUserEmail){
                res.status(StatusCodes.CONFLICT).json({
                    error: "Email is already taken"
                });
                return;
            }
    
            const existingUserUname = await prismaClient.author.findFirst({
                where: { username: username }
            });
            if (existingUserUname){
                res.status(StatusCodes.CONFLICT).json({
                    error: "Username is already taken"
                });
                return;
            }
    
            const hashedPass: string = await hash(password, 10);
            const newAuthor = await prismaClient.author.create({
                data: {
                    email: email,
                    username: username,
                    password: hashedPass,
                    name: name,
                    bio: bio,
                }
            });
    
            if (!newAuthor){
                res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                    error: ReasonPhrases.INTERNAL_SERVER_ERROR
                });
                return;
            }
    
            // await redisClient.set(`author_id:${newAuthor.author_id}`, JSON.stringify(newAuthor), 'EX', 3600);
    
            res.status(StatusCodes.CREATED).json({
                data: "Placeholder data, should be token"
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

    async login(req: Request, res: Response) {

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

            res.status(StatusCodes.CREATED).json({
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
            const username = req.params.identifier;
            if (!username){
                res.status(StatusCodes.BAD_REQUEST).json({
                    error: ReasonPhrases.BAD_REQUEST,
                });
                return;
            }

            const user = await prismaClient.author.findFirst({
                where: { username: username },
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

            res.status(StatusCodes.CREATED).json({
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
}