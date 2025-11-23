import { FastifyReply, FastifyRequest } from "fastify";
import {
  createNewRound,
  fetchRoundById,
  fetchRounds,
  tapRoundService,
} from "../services/round-service";
import { verifyToken } from "../utils/jwt";

export async function getRounds(req: FastifyRequest, reply: FastifyReply) {
  try {
    const rounds = await fetchRounds(req.server.prisma);
    reply.send(rounds);
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Cannot fetch rounds" });
  }
}

export async function createRound(req: FastifyRequest, reply: FastifyReply) {
  try {
    const token = req.cookies?.token;
    if (!token) return reply.code(401).send({ error: "Not authenticated" });

    const user = verifyToken<{ id: number; role: string; username: string }>(
      token
    );
    if (!user) return reply.code(401).send({ error: "Invalid token" });
    if (user.role !== "admin")
      return reply.code(403).send({ error: "Forbidden" });

    const round = await createNewRound(req.server.prisma);
    reply.send(round);
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Cannot create round" });
  }
}

export async function getRoundById(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    // Получаем userId из токена, если есть
    let userId: number | undefined = undefined;
    const token = req.cookies?.token;
    if (token) {
      const user = verifyToken<{ id: number; role: string; username: string }>(
        token
      );
      if (user) userId = user.id;
    }

    const roundId = Number(req.params.id);
    const round = await fetchRoundById(req.server.prisma, roundId, userId);

    if (!round) return reply.code(404).send({ error: "Round not found" });

    reply.send(round);
  } catch (err) {
    console.error(err);
    reply.code(500).send({ error: "Cannot fetch round" });
  }
}

export async function tapRound(
  req: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply
) {
  try {
    // 1. Проверяем токен
    const token = req.cookies?.token;
    if (!token) return reply.code(401).send({ error: "Not authenticated" });

    const user = verifyToken<{ id: number; role: string; username: string }>(
      token
    );
    if (!user) return reply.code(401).send({ error: "Invalid token" });

    // 2. Преобразуем id раунда
    const roundId = Number(req.params.id);

    // 3. Вызываем сервис тапов
    const result = await tapRoundService(req.server.prisma, roundId, user);

    // 4. Отправляем клиенту актуальные данные
    reply.send(result);
  } catch (err: any) {
    // Обработка ошибок
    console.error(err);

    if (err.message === "Round not found") {
      return reply.code(404).send({ error: "Round not found" });
    }

    if (err.message === "Round is not active") {
      return reply.code(400).send({ error: "Round is not active" });
    }

    reply.code(500).send({ error: "Cannot tap" });
  }
}
