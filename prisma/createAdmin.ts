import { PrismaClient } from '@prisma/client'
import { hash } from "bcrypt";

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await hash('@admin@2025!1', 12)
  await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@admin.com',
      password: hashedPassword,
      role: 'ADMIN'
    },
  })
}

main()
  .catch(e => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
