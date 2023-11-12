import { Request, Response } from 'express';
import { ReasonPhrases, StatusCodes } from 'http-status-codes';
import { prismaClient } from '../config/prisma-config';
import { hash, compare } from 'bcrypt';
import jwt from 'jsonwebtoken';
import { jwtExpireTime, jwtSecretKey } from '../config/jwt-config';
import { TokenRequest } from '../types/TokenRequest';
import { z } from 'zod';
import { BookPRequest } from '../types/BookPRequest';
import { AuthToken } from '../types/AuthToken';

export class BookPModel {
    async getBooksP(req: Request, res:Response) {
        const books = await prismaClient.bookPremium.findMany({
            select: {
                bookp_id: true,
                title: true,
                synopsis: true,
                genre: true,
                release_date: true,
                word_count: true,
                duration: true,
                graphic_cntn: true,
                image_path: true,
                audio_path: true,
                author_id: true,
            }
        });

        res.status(StatusCodes.OK).json({
            data: books
        });
        console.log("Premium Books fetched")
        return;
    }

    async createBookP(req: Request, res: Response) {
        let bookpRequest: BookPRequest;
        try {
            bookpRequest = req.body;
        } catch (error) {
            res.status(StatusCodes.BAD_REQUEST).json({
                error: ReasonPhrases.BAD_REQUEST,
            });
            return;
        }

        const existingBookPTitle = await prismaClient.bookPremium.findFirst({
            where: { title: bookpRequest.title }
        });

        if (existingBookPTitle) {
            res.status(StatusCodes.CONFLICT).json({
                error: "Title of the book already used once"
            });
            return;
        }

        const newBookP = await prismaClient.bookPremium.create({
            data: bookpRequest
        })

        if (!newBookP) {
            res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: ReasonPhrases.INTERNAL_SERVER_ERROR
            });
            return;
        }

        res.status(StatusCodes.CREATED).json({
            data: {
                bookp_id: newBookP.bookp_id,
                title: newBookP.title,
                synopsis: newBookP.synopsis,
                genre: newBookP.genre,
                release_date: newBookP.release_date,
                word_count: newBookP.word_count,
                duration: newBookP.duration,
                graphic_cntn: newBookP.graphic_cntn,
                image_path: newBookP.image_path,
                audio_path: newBookP.audio_path,
                author_id: newBookP.author_id,
            }
        });
        console.log("Book Premium created")
        return;
    }

    async getBookPByID(req: Request, res: Response) {
        let notId: boolean = false;
        
        console.log("Checking by ID");
        const id = req.params.identifier;
        if (!id) {
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

        const bookp = await prismaClient.bookPremium.findFirst({
            where : { bookp_id: numberId },
            select : {
                bookp_id: true,
                title: true,
                synopsis: true,
                genre: true,
                release_date: true,
                word_count: true,
                duration: true,
                graphic_cntn: true,
                image_path: true,
                audio_path: true,
                author_id: true,
            }
        });

        if (!bookp) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "User does not exist"
            });
            return;
        }

        res.status(StatusCodes.OK).json({
            data: bookp
        });
        console.log("Book Premium fetched");
        return;
    }

    async getBookPByAuthorID(req: Request, res: Response) {
        let notId: boolean = false;

        console.log("Checking by author ID");
        const author_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));

        if (!author_id.success){
            console.error(req.params.identifier)
            res.status(StatusCodes.BAD_REQUEST).json({
                error: author_id.error.message,
            });
            return;
        }

        const bookp = await prismaClient.bookPremium.findFirst({
            where: { author_id: author_id.data },
            select: {
                bookp_id: true,
                title: true,
                synopsis: true,
                genre: true,
                release_date: true,
                word_count: true,
                duration: true,
                graphic_cntn: true,
                image_path: true,
                audio_path: true,
                author_id: true,
            }
        });

        if (!bookp) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "User does not exist"
            });
            return;
        }

        res.status(StatusCodes.OK).json({
            data: bookp
        });
        console.log("Book Premium fetched");
        return;
    }

    async deleteBookPByID(req: Request, res: Response) {
        let notId: boolean = false;

        console.log("checking ID")
        const id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if (!id.success){
            console.error(req.params.identifier)
            res.status(StatusCodes.BAD_REQUEST).json({
                error: id.error.message,
            });
            return;
        }

        try {
            const bookp = await prismaClient.bookPremium.delete({
                where: { bookp_id: id.data }                
            });

            res.status(StatusCodes.OK).json({
                data: bookp
            });
            return;
        } catch (error) {
            res.status(StatusCodes.NOT_FOUND).json({
                error: "Book does not exist"
            });
            console.log("Book deleted");
            return;
        }
    }


}
