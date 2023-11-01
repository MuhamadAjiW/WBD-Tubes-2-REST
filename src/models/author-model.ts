import express, { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { prismaClient } from '../config/prisma-config';
import { hash } from 'bcrypt';
import { redisClient } from '../config/redis-config';

interface AuthorRequest {
    email: string;
    username: string;
    password: string;
    name: string;
    bio: string;
}

export class AuthorModel {
    async register(req: Request, res: Response) {
        const {email, username, password, name, bio}: AuthorRequest = req.body;
        if (!email || !username || !password || !name || !bio){
            res.status(StatusCodes.BAD_REQUEST).json({
                message: ReasonPhrases.BAD_REQUEST,
            });
            return;
        }
        
        const existingUserEmail = await prismaClient.author.findFirst({
            where: { email: email }
        });
        if (existingUserEmail){
            res.status(StatusCodes.CONFLICT).json({
                message: "Email is already taken"
            });
            return;
        }

        const existingUserUname = await prismaClient.author.findFirst({
            where: { username: username }
        });
        if (existingUserUname){
            res.status(StatusCodes.CONFLICT).json({
                message: "Username is already taken"
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
                message: ReasonPhrases.INTERNAL_SERVER_ERROR
            });
            return;
        }

        // await redisClient.set(`author_id:${newAuthor.author_id}`, JSON.stringify(newAuthor), 'EX', 3600);

        res.status(StatusCodes.CREATED).json({
            message: ReasonPhrases.CREATED
        })
        console.log("Author created");
        return;
    }

    async login(req: Request, res: Response) {

    }
}