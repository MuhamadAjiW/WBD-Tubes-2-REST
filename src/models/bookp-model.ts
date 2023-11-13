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
import { promises as fsPromises } from 'fs';
import path, { dirname } from 'path';
import { BadRequestError } from '../types/errors/BadRequestError';
import { NotFoundError } from '../types/errors/NotFoundError';
import { BookPUpdateRequest } from '../types/BookPUpdateRequest';
import { ConflictError } from '../types/errors/ConflictError';

async function readBinaryFile(filePath: string): Promise<Buffer | string> {
    try {
        const fileContents = await fsPromises.readFile(filePath)
        return fileContents;
    } catch (error) {
        console.error(`Error reading file ${filePath}`, error)
        return "Not Exist";
    }
}

async function getBase64FromFile(filePath: string): Promise<string | null> {
    const fileContents = await readBinaryFile(filePath);
    if (fileContents) {
      return fileContents.toString('base64');
    }
    return "Not Exist";
  }

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
        console.log(req.params.identifier)
        const author_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));

        if (!author_id.success){
            throw new BadRequestError(author_id.error.message)
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
                error: "Author does not exist"
            });
            return;
        }

        // Read image and audio files
        const imageData = bookp.image_path ? await getBase64FromFile(bookp.image_path) : "notExist";
        const audioData = bookp.audio_path ? await getBase64FromFile(bookp.audio_path) : "notExist";


        res.status(StatusCodes.OK).json({
            data: {
                bookp,
                imageBase64: imageData,
                audioBase64: audioData,
            }
        });
        console.log("Book Premium fetched");
        return;
    }

    async deleteBookPByID(req: Request, res: Response) {
        let notId: boolean = false;

        console.log("checking ID")
        const id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if (!id.success){
            throw new BadRequestError(id.error.message)
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

    async editBookP(req: Request, res: Response) {
        const bookp_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if(!bookp_id.success){
            throw new BadRequestError(bookp_id.error.message);
        }

        const currentBook = await prismaClient.bookPremium.findFirst({
            where: { bookp_id: bookp_id.data }
        });

        if (!currentBook){
            throw new NotFoundError("Book does not exist");
        }

        const bookPRequest = BookPUpdateRequest.safeParse(req.body);
        if (!bookPRequest.success) {
            throw new BadRequestError(bookPRequest.error.message);
        }

        const requestData: BookPUpdateRequest = bookPRequest.data

        if (requestData.title && requestData.title != currentBook.title) {
            const existingBookTitle = await prismaClient.bookPremium.findFirst({
                where: { title: requestData.title }
            });
            if (existingBookTitle) {
                throw new ConflictError("Title has already been used")
            }
        }

        const newBookP = await prismaClient.bookPremium.update({
            where: { bookp_id: bookp_id.data },
            data: requestData
        })

        if (!newBookP) {
            throw new Error("Failed to update book");
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
            }
        })

        console.log("Book Premium edited")
        return;
    }

}
