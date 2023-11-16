import { Router } from "express";
import { PlaylistController } from "../controllers/playlist-controller";
import { AuthMiddleware } from "../middlewares/auth-middleware";
import { AuthTypes } from "../types/enums/AuthTypes";

export class PlaylistRoute {
    playlistController: PlaylistController;
    authMiddleware: AuthMiddleware;

    constructor() {
        this.playlistController = new PlaylistController();
        this.authMiddleware = new AuthMiddleware();
    }

    getRoutes() {
        return Router()
            .post('/playlists',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.playlistController.createPlaylist())
            .delete('/playlists/:identifier',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.playlistController.deleteOnePlaylist())
            .patch('/playlists/:identifier',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.playlistController.updateOnePlaylist())
            .get('/playlists/:identifier/books',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.playlistController.getPlaylistBooks())
            .post('/playlists/:identifier/books',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.playlistController.addPlaylistBook())
            .delete('/playlists/:identifier/books',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.playlistController.deletePlaylistBook())

            .get('/authors/:identifier/playlists',
                this.authMiddleware.authenticate(AuthTypes.ANYAUTH),
                this.playlistController.getPlaylists())
    }
}