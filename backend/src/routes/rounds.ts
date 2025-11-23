import { FastifyInstance } from "fastify";
import {
  createRound,
  getRoundById,
  getRounds,
  tapRound,
} from "../controllers/rounds-controller";

export default async function roundsRoutes(fastify: FastifyInstance) {
  fastify.get("/rounds", getRounds);
  fastify.post("/rounds", createRound);
  fastify.get<{ Params: { id: string } }>("/rounds/:id", getRoundById);
  fastify.post<{ Params: { id: string } }>("/rounds/:id/tap", tapRound);
}
