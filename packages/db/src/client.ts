import { PrismaClient } from '@prisma/client'

// Ensure single PrismaClient instance across hot reloads in dev
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const globalForPrisma = global as any as { prisma?: PrismaClient }

export const prisma = globalForPrisma.prisma || new PrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

export default prisma
