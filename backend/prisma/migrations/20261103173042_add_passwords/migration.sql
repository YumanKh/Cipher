-- CreateTable
CREATE TABLE "Passwords" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "isFavorite" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "Passwords_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Passwords" ADD CONSTRAINT "Passwords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
