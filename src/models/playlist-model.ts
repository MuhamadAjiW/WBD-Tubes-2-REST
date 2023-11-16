import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { prismaClient } from '../config/prisma-config';
import { z } from 'zod';
import { PlaylistEntryRequest } from '../types/PlaylistEntryRequest';
import { BadRequestError } from '../types/errors/BadRequestError';
import { PlaylistAddRequest } from '../types/PlaylistAddRequest';
import * as fs from "fs";
import path from 'path';
import { NotFoundError } from '../types/errors/NotFoundError';
import { PlaylistEditRequest } from '../types/PlaylistEditRequest';
import { ConflictError } from '../types/errors/ConflictError';

export class PlaylistModel {
    async getAuthorPlaylists(req: Request, res:Response) {
        let notId: boolean = false;

        const author_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));

        if (!author_id.success) {
            throw new BadRequestError(author_id.error.message)
        }

        const playlists = await prismaClient.playlist.findMany({
            where: { author_id: author_id.data},
            select: {
                playlist_id: true,
                title: true,
                description: true,
                image_path: true,
                author_id: true,
            }
        })

        if (!playlists) {
            throw new NotFoundError("Author does not exist");
        }

        res.status(StatusCodes.OK).json({
            message: "Playlist fetch successful",
            valid: true,
            data: playlists
        });
        console.log("Playlists fetched");
        return;
    }

    async createPlaylist(req: Request, res: Response) {
        let playlistRequest: PlaylistAddRequest;

        try {
            playlistRequest = req.body;
        } catch (error) {
            throw new BadRequestError("Bad request params");
        }

        const existingPlaylistTitle = await prismaClient.playlist.findFirst({
            where: {
                title: playlistRequest.title,
                author_id: playlistRequest.author_id,
            }
        });

        if (existingPlaylistTitle) {
            throw new ConflictError("Title of the book already used once");
        }

        // Decode base64-encoded image and audio content
        const imageData = Buffer.from(playlistRequest.image, 'base64');

        // Generate unique filenames based on timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const imageFilename = `image_${timestamp}_${randomString}.png`;

        const imagePath = 'static/images/' + imageFilename

        playlistRequest.image_path = imagePath;

        const newPlaylist = await prismaClient.playlist.create({
            data: {
                title: playlistRequest.title,
                description: playlistRequest.description,
                author_id: playlistRequest.author_id,
                image_path: playlistRequest.image_path,
            }
        })

        if (!newPlaylist) {
            throw Error();
        }

        await fs.writeFileSync(
            path.join(
                __dirname,
                "..",
                "..",
                imagePath
            ), imageData
        )

        res.status(StatusCodes.CREATED).json({
            message: "Playlist creation successful",
            valid: true,
            data: {
                playlist_id: newPlaylist.playlist_id,
                title: newPlaylist.title,
                description: newPlaylist.description,
                image_path: newPlaylist.image_path,
                author_id: newPlaylist.author_id,
            }
        });
        console.log("Playlist created")
        return;
    }

    async getPlaylistBooks(req: Request, res: Response) {
        let notId: boolean = false;

        const playlist_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));

        if (!playlist_id.success) {
            throw new BadRequestError(playlist_id.error.message)
        }

        // Get books in the playlists
        const playlistData = await prismaClient.playlist.findUnique({
            where: { playlist_id: playlist_id.data },
        })

        const booksInPlaylist = await prismaClient.playlistBook.findMany({
            where: {
              playlist_id: playlist_id.data,
            },
            include: {
              bookp: {
                select: {
                  bookp_id: true,
                  title: true,
                  synopsis: true,
                  author_id: true,
                  genre: true,
                  release_date: true,
                  word_count: true,
                  duration: true,
                  graphic_cntn: true,
                  image_path: true,
                  audio_path: true,
                },
              },
            },
          });

        if (!booksInPlaylist) {
            throw Error();
        }
        
        if (!playlistData) {
            throw Error();
        }

        const author_id = playlistData.author_id;

        let offsetLimit = await prismaClient.bookPremium.count();
        offsetLimit = offsetLimit >= 5? offsetLimit - 5 : 0;
        const recommendationBooks = await prismaClient.bookPremium.findMany({
            where: {
                PlaylistBook: {
                    none: {
                        playlist_id: playlist_id.data,
                    }
                }
            },
            skip: Math.floor(Math.random() * (offsetLimit)),
            take: 5,
        })

        if (!recommendationBooks) {
            throw Error();
        }

        // Get author data
        const authorData = await prismaClient.author.findFirst({
            where: { author_id: author_id }
        })

        if (!authorData) {
            throw Error();
        }

        res.status(StatusCodes.OK).json({
            message: "Playlist books fetch successful",
            valid: true,
            data: {
                playlistData: playlistData,
                recommendationBooks: recommendationBooks,
                booksInPlaylist: booksInPlaylist,
                authorData: authorData,
            }
        })
    }

    async deletePlaylistByID(req: Request, res: Response) {
        let notId: boolean = false;

        const id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if (!id.success){
            throw new BadRequestError(id.error.message)
        }

        try {
            const dummyPlaylist = await prismaClient.playlist.findFirst({
                where: {playlist_id: id.data}
            })

            if (dummyPlaylist) {
                fs.unlinkSync(
                    path.join(
                        __dirname,
                        "..",
                        "..",
                        dummyPlaylist.image_path
                    )
                )
            }


            const playlist = await prismaClient.playlist.delete({
                where: {playlist_id: id.data}
            })

            res.status(StatusCodes.OK).json({
                message: "Playlist deletion successful",
                valid: true,
                data: playlist
            });

            
            console.log("Playlist deleted");

            return;
        } catch (error) {
            throw new NotFoundError("Playlist does not exist");
        }
    }

    async editPlaylistByID(req: Request, res: Response) {
        const playlist_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if(!playlist_id.success){
            throw new BadRequestError(playlist_id.error.message);
        }

        const currentPlaylist = await prismaClient.playlist.findFirst({
            where: { playlist_id: playlist_id.data }
        });

        if (!currentPlaylist) {
            throw new NotFoundError("Playlist does not exist");
        }

        const playlistRequest = PlaylistEditRequest.safeParse(req.body);
        if (!playlistRequest.success) {
            throw new BadRequestError(playlistRequest.error.message);
        }
        
        const requestData: PlaylistEditRequest = playlistRequest.data

        if (requestData.title && requestData.title != currentPlaylist.title) {
            const existingPlaylistTitle = await prismaClient.playlist.findFirst({
                where: {
                    title: requestData.title,
                    author_id: requestData.author_id,
                }
            });

            if (existingPlaylistTitle) {
                throw new ConflictError("Title has already been used")
            }
        }

        // Generate unique filenames based on timestamp and random string
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(7);
        const imageFilename = `image_${timestamp}_${randomString}.png`;

        let newImagePath = 'static/images/' + imageFilename

        if (requestData.image) {
            requestData.image_path = newImagePath
        }

        const data: {
            title?: string;
            description?: string;
            image_path?: string;
            author_id?: number;
        } = {
            title: requestData.title,
            description: requestData.description,
            author_id: requestData.author_id,
        }

        if (requestData.image_path !== "") {
            data.image_path = requestData.image_path
        }

        const newPlaylist = await prismaClient.playlist.update({
            where: { playlist_id: playlist_id.data },
            data: data
        })

        if (!newPlaylist) {
            throw new Error("Failed to update playlist")
        }

        if (requestData.image && requestData.image_path) {
            const imageData = Buffer.from(requestData.image, 'base64');
            await fs.unlinkSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    currentPlaylist.image_path
                )
            );

            fs.writeFileSync(
                path.join(
                    __dirname,
                    "..",
                    "..",
                    requestData.image_path
                ),
                imageData
            )
        }

        res.status(StatusCodes.OK).json({
            message: "Playlist edition successful",
            valid: true,
            data: {
                playlist_id: newPlaylist.playlist_id,
                title: newPlaylist.title,
                description: newPlaylist.description,
                image_path: newPlaylist.image_path,
                author_id: newPlaylist.author_id,
            }
        })

        console.log("Playlist edited")
        return;
    }

    async addPlaylistBook(req: Request, res: Response) {
        const playlist_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if(!playlist_id.success){
            throw new BadRequestError(playlist_id.error.message);
        }

        let playlistRequest: PlaylistEntryRequest;

        try {
            playlistRequest = req.body;
        } catch (error) {
            throw new BadRequestError("Bad request params");
        }

        const newPlaylistBook = await prismaClient.playlistBook.create({
            data: {
                playlist_id: playlistRequest.playlist_id,
                bookp_id: playlistRequest.bookp_id,
            }
        })

        if (!newPlaylistBook) {
            throw Error();
        }

        res.status(StatusCodes.CREATED).json({
            message: "Playlist book addition successful",
            valid: true,
            data: {
                playlist_id: newPlaylistBook.playlist_id,
                bookp_id: newPlaylistBook.bookp_id,
            }
        })
        console.log("Book added to playlist")
        return;
    }

    async deletePlaylistBook(req: Request, res: Response) {
        const playlist_id = z.number().int().safeParse(parseInt(req.params.identifier, 10));
        if(!playlist_id.success){
            throw new BadRequestError(playlist_id.error.message);
        }

        let playlistRequest: PlaylistEntryRequest;

        try {
            playlistRequest = req.body;
        } catch (error) {
            throw new BadRequestError("Bad request params");
        }
        try {
            const deletePlaylistBook = await prismaClient.playlistBook.delete({
                where: {
                    playlist_id_bookp_id: {
                        playlist_id: playlistRequest.playlist_id,
                        bookp_id: playlistRequest.bookp_id,
                    },
                }
            })
    
            res.status(StatusCodes.OK).json({
                message: "Playlist book deletion successful",
                valid: true,
                data: deletePlaylistBook
            })
    
            console.log("Book deleted from playlist")
            return;
        } catch (error) {
            throw new Error("Playlist or book does not exist");
        }
    }
}
