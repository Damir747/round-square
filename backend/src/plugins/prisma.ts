import fp from "fastify-plugin";
import { PrismaClient } from "@prisma/client";

export default fp(async (fastify, opts) => {
  const prisma = new PrismaClient();
  fastify.decorate("prisma", prisma);
  fastify.addHook("onClose", async () => {
    await prisma.$disconnect();
  });
});

declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
}
