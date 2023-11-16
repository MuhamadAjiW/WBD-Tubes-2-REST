import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../config/prisma-config';
import { z } from 'zod';
import path from 'path';
import { BadRequestError } from '../types/errors/BadRequestError';
import { NotFoundError } from '../types/errors/NotFoundError';
import { BookPUpdateRequest } from '../types/BookPUpdateRequest';
import {BookPAddRequest} from '../types/BookPAddRequest'
import { ConflictError } from '../types/errors/ConflictError';
import * as fs from "fs";

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
            message: "Premium Books fetch successful",
            valid: true,
            data: books
        });
        console.log("Premium Books fetched")
        return;
    }

    async createBookP(req: Request, res: Response) {
        
        let bookpRequest: BookPAddRequest;
        try {
            bookpRequest = req.body;

        } catch (error) {
            throw new BadRequestError("Bad request parameters");
        }

        const existingBookPTitle = await prismaClient.bookPremium.findFirst({
            where: {
                title: bookpRequest.title,
                author_id: bookpRequest.author_id,
            }
        });

        if (existingBookPTitle) {
            throw new ConflictError("Title of the book already used once");
        }

        // Decode base64-encoded image and audio content
        const imageData = Buffer.from(bookpRequest.image, 'base64');
        const audioData = Buffer.from(bookpRequest.audio, 'base64');

        // Generate unique filenames based on timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const imageFilename = `image_${timestamp}_${randomString}.png`;
        const audioFilename = `audio_${timestamp}_${randomString}.mp3`;

        const imagePath = 'static/images/' + imageFilename
        const audioPath = 'static/audios/' + audioFilename

        bookpRequest.image_path = imagePath;
        bookpRequest.audio_path = audioPath;

        const newBookP = await prismaClient.bookPremium.create({
            data: {
                title: bookpRequest.title,
                synopsis: bookpRequest.synopsis,
                genre: bookpRequest.genre,
                release_date: bookpRequest.release_date,
                word_count: bookpRequest.word_count,
                duration: bookpRequest.duration,
                graphic_cntn: bookpRequest.graphic_cntn,
                image_path: bookpRequest.image_path,
                audio_path: bookpRequest.audio_path,
                author_id: bookpRequest.author_id,
            }
        })

        if (!newBookP) {
            throw new Error();
        }

        await fs.writeFileSync(
            path.join(
                __dirname,
                "..",
                "..",
                imagePath
            ), imageData
        );

        await fs.writeFileSync(
            path.join(
                __dirname,
                "..",
                "..",
                audioPath
            ), audioData
        );

        res.status(StatusCodes.CREATED).json({
            message: "Book creation successful",
            valid: true,
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
        
        const id = req.params.identifier;
        if (!id) {
            throw new BadRequestError("Id not provided");
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
            throw new NotFoundError("User does not exist");
        }

        res.status(StatusCodes.OK).json({
            message: "Premium Books fetch successful",
            valid: true,
            data: bookp
        });
        console.log("Book Premium fetched");
        return;
    }

    async getBookPByAuthorID(req: Request, res: Response) {
        let notId: boolean = false;

        const author_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));

        if (!author_id.success){
            throw new BadRequestError(author_id.error.message)
        }

        const bookp = await prismaClient.bookPremium.findMany({
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
            throw new NotFoundError("Author does not exist");
        }


        res.status(StatusCodes.OK).json({
            message: "Premium Books fetch successful",
            valid: true,
            data: bookp
        });
        console.log("Book Premium fetched");
        return;
    }

    async deleteBookPByID(req: Request, res: Response) {
        let notId: boolean = false;

        const id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if (!id.success){
            throw new BadRequestError(id.error.message)
        }

        try {
            const dummybook = await prismaClient.bookPremium.findFirst({
                where: { bookp_id: id.data }
            })

            // Delete from storage
            if (dummybook) {
                fs.unlinkSync(
                    path.join(
                        __dirname,
                        "..",
                        "..",
                        dummybook.image_path
                    )
                );
    
                fs.unlinkSync(
                    path.join(
                        __dirname,
                        "..",
                        "..",
                        dummybook.audio_path
                    )
                );
            }

            const bookp = await prismaClient.bookPremium.delete({
                where: { bookp_id: id.data }                
            });

            res.status(StatusCodes.OK).json({
                message: "Premium Books deletion successful",
                valid: true,
                data: bookp
            });

            
            console.log("Book deleted");


            return;
        } catch (error) {
            throw new NotFoundError("Book does not exist");
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
                where: { title: requestData.title,
                         author_id: currentBook.author_id }
            });
            if (existingBookTitle) {
                throw new ConflictError("Title has already been used")
            }
        }

        // Generate unique filenames based on timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const imageFilename = `image_${timestamp}_${randomString}.png`;
        const audioFilename = `audio_${timestamp}_${randomString}.mp3`;

        let newImagePath = 'static/images/' + imageFilename
        let newAudioPath = 'static/audios/' + audioFilename
        
        if (requestData.image) {
            requestData.image_path = newImagePath
        }

        if (requestData.audio) {
            requestData.audio_path = newAudioPath 
        }

        const data: {
            title?: string;
            synopsis?: string;
            genre?: string;
            release_date: Date;
            word_count?: number; 
            duration?: number;
            graphic_cntn?: boolean;
            image_path?: string;
            audio_path?: string;
        } = {
            title: requestData.title,
            synopsis: requestData.synopsis,
            genre: requestData.genre,
            release_date: requestData.release_date,
            word_count: requestData.word_count,
            duration: requestData.duration,
            graphic_cntn: requestData.graphic_cntn,
        };

        if (requestData.image_path !== "") {
            data.image_path = requestData.image_path;
        }

        if (requestData.audio_path !== "") {
            data.audio_path = requestData.audio_path;
        }

        const newBookP = await prismaClient.bookPremium.update({
            where: { bookp_id: bookp_id.data },
            data: data,
        })

        if (!newBookP) {
            throw new Error("Failed to update book");
        }

        if (requestData.image && requestData.image_path) {
            const imageData = Buffer.from(requestData.image, 'base64');
            await fs.unlinkSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    currentBook.image_path
                )
            );

            await fs.writeFileSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    requestData.image_path
                ),
                imageData
            )
        }

        if (requestData.audio && requestData.audio_path) {
            const audioData = Buffer.from(requestData.audio, 'base64');

            await fs.unlinkSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    currentBook.audio_path
                )
            );

            await fs.writeFileSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    requestData.audio_path
                ),
                audioData
            )
        }

        res.status(StatusCodes.OK).json({
            message: "Book edition successful",
            valid: true,
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
