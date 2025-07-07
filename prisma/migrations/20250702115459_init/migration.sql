-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "serviceName" TEXT,
ALTER COLUMN "barberId" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "Appointment" ADD CONSTRAINT "Appointment_barberId_fkey" FOREIGN KEY ("barberId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
