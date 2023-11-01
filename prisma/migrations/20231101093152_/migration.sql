-- CreateTable
CREATE TABLE "Author" (
    "author_id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "bio" TEXT NOT NULL,

    CONSTRAINT "Author_pkey" PRIMARY KEY ("author_id")
);

-- CreateTable
CREATE TABLE "BookPremium" (
    "bookp_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "synopsis" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,
    "genre" TEXT NOT NULL,
    "release_date" TIMESTAMP(3) NOT NULL,
    "word_count" INTEGER NOT NULL,
    "duration" INTEGER NOT NULL,
    "graphic_cntn" BOOLEAN NOT NULL,
    "image_path" TEXT NOT NULL,
    "audio_path" TEXT NOT NULL,

    CONSTRAINT "BookPremium_pkey" PRIMARY KEY ("bookp_id")
);

-- CreateTable
CREATE TABLE "Playlist" (
    "playlist_id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author_id" INTEGER NOT NULL,

    CONSTRAINT "Playlist_pkey" PRIMARY KEY ("playlist_id")
);

-- CreateTable
CREATE TABLE "PlaylistBook" (
    "playlist_id" INTEGER NOT NULL,
    "bookp_id" INTEGER NOT NULL,

    CONSTRAINT "PlaylistBook_pkey" PRIMARY KEY ("playlist_id","bookp_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Author_username_key" ON "Author"("username");

-- CreateIndex
CREATE UNIQUE INDEX "BookPremium_title_key" ON "BookPremium"("title");

-- CreateIndex
CREATE UNIQUE INDEX "BookPremium_synopsis_key" ON "BookPremium"("synopsis");

-- AddForeignKey
ALTER TABLE "BookPremium" ADD CONSTRAINT "BookPremium_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("author_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Playlist" ADD CONSTRAINT "Playlist_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "Author"("author_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistBook" ADD CONSTRAINT "PlaylistBook_playlist_id_fkey" FOREIGN KEY ("playlist_id") REFERENCES "Playlist"("playlist_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlaylistBook" ADD CONSTRAINT "PlaylistBook_bookp_id_fkey" FOREIGN KEY ("bookp_id") REFERENCES "BookPremium"("bookp_id") ON DELETE RESTRICT ON UPDATE CASCADE;
