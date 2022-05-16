-- AlterTable
ALTER TABLE "Chatroom" ADD COLUMN     "announcementChat" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AnnouncementMessages" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    "from" JSONB NOT NULL,
    "readBy" JSONB[],
    "chatroomId" TEXT NOT NULL,
    "ownerId" TEXT,
    "dspId" TEXT,
    "managerId" TEXT,

    CONSTRAINT "AnnouncementMessages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_chatroomId_fkey" FOREIGN KEY ("chatroomId") REFERENCES "Chatroom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Owner"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_dspId_fkey" FOREIGN KEY ("dspId") REFERENCES "Dsp"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnnouncementMessages" ADD CONSTRAINT "AnnouncementMessages_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "Manager"("id") ON DELETE SET NULL ON UPDATE CASCADE;
