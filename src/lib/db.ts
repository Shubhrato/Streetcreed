import { PrismaClient } from "@prisma/client";

/**
 * Prisma singleton — one client per process (dev hot-reload safe).
 * The database is only touched by auth + (future) order services;
 * the storefront catalog runs on the mock service layer until you
 * set DATABASE_URL and swap src/lib/services/products.ts internals.
 */
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
