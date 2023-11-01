interface PlaylistRequest {
    title: string;
    description: string;
    author_id: number;
}

interface PlaylistEntryRequest {
    playlist_id: number;
    bookp_id: number;
}
