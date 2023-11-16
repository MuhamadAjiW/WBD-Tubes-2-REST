import { Router } from "express";
import { PlaylistController } from "../controllers/playlist-controller";

export class PlaylistRoute {
    playlistController: PlaylistController;

    constructor() {
        this.playlistController = new PlaylistController();
    }

    getRoutes() {
        return Router()
            .post('/playlists',
                this.playlistController.createPlaylist())
            .delete('/playlists/:identifier',
                this.playlistController.deleteOnePlaylist())
            .patch('/playlists/:identifier',
                this.playlistController.updateOnePlaylist())
            .get('/playlists/:identifier/books',
                this.playlistController.getPlaylistBooks())
            .post('/playlists/:identifier/books',
                this.playlistController.addPlaylistBook())
            .delete('/playlists/:identifier/books',
                this.playlistController.deletePlaylistBook())

            .get('/authors/:identifier/playlists',
                this.playlistController.getPlaylists())
    }
}