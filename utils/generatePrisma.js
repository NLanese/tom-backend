import prisma from '@prisma/client'

const db = new prisma.PrismaClient({
    log: ['info', 'warn'],
    errorFormat: 'pretty',
})

export default db