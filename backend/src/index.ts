import dotenv from "dotenv";
import Fastify from "fastify";
import cookiePlugin from "./plugins/cookies";
import corsPlugin from "./plugins/cors";
import prismaPlugin from "./plugins/prisma.js";
import authRoutes from "./routes/auth";
import roundsRoutes from "./routes/rounds";

dotenv.config();

const ROUND_DURATION = Number(process.env.ROUND_DURATION) || 60;
const COOLDOWN_DURATION = Number(process.env.COOLDOWN_DURATION) || 30;

const fastify = Fastify({ logger: true });

// 1. CORS первым
fastify.register(corsPlugin);

// 2. Prisma и cookie — до роутов
fastify.register(prismaPlugin);
fastify.register(cookiePlugin);

// 3. Роуты
fastify.register(authRoutes);
fastify.register(roundsRoutes);

const start = async () => {
  try {
    await fastify.listen({ port: 3001 });
    fastify.log.info("Server started on 3001");
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
