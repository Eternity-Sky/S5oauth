import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
  pgPool: pg.Pool;
};

const createPrismaClient = () => {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error("DATABASE_URL 环境变量缺失。请在部署后台配置它。");
  }

  // 为 Cloudflare Workers / Edge Runtime 优化
  if (!globalForPrisma.pgPool) {
    globalForPrisma.pgPool = new pg.Pool({
      connectionString,
      max: 1, 
      // 在某些 Edge 环境下，可能需要额外的 SSL 配置
      ssl: connectionString.includes("localhost") ? false : { rejectUnauthorized: false }
    });
  }

  const adapter = new PrismaPg(globalForPrisma.pgPool);
  return new PrismaClient({ adapter });
};

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
