import { Request, Response } from "express";
import { PlaylistModel } from "../models/playlist-model";

export class PlaylistController {
    playlistModel: PlaylistModel;

    constructor() {
        this.playlistModel = new PlaylistModel();
    }

    createPlaylist() {
        return async (req: Request, res: Response) => {
            return await this.playlistModel.createPlaylist(req, res);
        }
    }

    getPlaylists() {
        return async (req: Request, res: Response) => {
            return await this.playlistModel.getAuthorPlaylists(req, res);
        }
    }

    deleteOnePlaylist() {
        return async (req: Request, res: Response) => {
            return await this.playlistModel.deletePlaylistByID(req, res);
        }
    }

    updateOnePlaylist() {
        return async (req: Request, res: Response) => {
            return await this.playlistModel.editPlaylistByID(req, res);
        }
    }

    getPlaylistBooks() {
        return async (req: Request, res: Response) => {
            return await this.playlistModel.getPlaylistBooks(req, res);
        }
    }

    addPlaylistBook() {
        return async (req: Request, res: Response) => {
            return await this.playlistModel.addPlaylistBook(req, res);
        }
    }

    deletePlaylistBook() {
        return async (req: Request, res: Response) => {
            return await this.playlistModel.deletePlaylistBook(req, res);
        }
    }
}