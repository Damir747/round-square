import { PrismaClient } from "@prisma/client";
import { ROUND_STATUS, type TRound, type TStatus } from "../../../shared/types";

export async function createNewRound(prisma: PrismaClient) {
  const now = new Date();

  const COOLDOWN = Number(process.env.COOLDOWN_DURATION) * 1000; // мс
  const DURATION = Number(process.env.ROUND_DURATION) * 1000; // мс

  // Дата старта = сейчас + cooldown
  const startAt = new Date(now.getTime() + COOLDOWN);

  // Дата окончания = startAt + duration
  const endAt = new Date(startAt.getTime() + DURATION);

  const round = await prisma.round.create({
    data: {
      name: "",
      startAt,
      endAt,
      taps: 0,
      points: 0,
    },
  });

  return prisma.round.update({
    where: { id: round.id },
    data: { name: `Round ${round.id}` },
  });
}

export async function fetchRounds(prisma: PrismaClient) {
  return prisma.round.findMany({ orderBy: { startAt: "desc" } });
}

export async function fetchRoundById(
  prisma: PrismaClient,
  roundId: number,
  userId?: number
): Promise<TRound | null> {
  const round = await prisma.round.findUnique({
    where: { id: roundId },
    include: { roundUsers: true },
  });

  if (!round) return null;

  const now = new Date();
  let status: TStatus;
  let timeLeft = 0;

  if (now < round.startAt) {
    status = ROUND_STATUS.NOT_STARTED;
    timeLeft = Math.floor((round.startAt.getTime() - now.getTime()) / 1000);
  } else if (now >= round.startAt && now < round.endAt) {
    status = ROUND_STATUS.ACTIVE;
    timeLeft = Math.floor((round.endAt.getTime() - now.getTime()) / 1000);
  } else {
    status = ROUND_STATUS.FINISHED;
    timeLeft = 0;
  }

  // очки текущего пользователя
  const userRound = userId
    ? round.roundUsers.find((ru) => ru.userId === userId)
    : undefined;

  const myPoints = userRound?.points ?? 0;

  // победитель
  let winner: { username: string; points: number } | null = null;

  if (status === ROUND_STATUS.FINISHED && round.roundUsers.length > 0) {
    const top = round.roundUsers.reduce((prev, curr) =>
      curr.points > prev.points ? curr : prev
    );

    const user = await prisma.user.findUnique({ where: { id: top.userId } });

    winner = user ? { username: user.username, points: top.points } : null;
  }

  return {
    id: round.id,
    name: round.name,
    startAt: new Date(round.startAt), // <- приводим к Date
    endAt: new Date(round.endAt), // <- приводим к Date
    taps: round.taps,
    points: round.points,
    status,
    timeLeft: Math.max(0, timeLeft),
    myPoints,
    winner,
  };
}

type User = {
  id: number;
  role: string;
  username: string;
};

export async function tapRoundService(
  prisma: PrismaClient,
  roundId: number,
  user: User
) {
  return prisma.$transaction(async (tx) => {
    const now = new Date();

    // Сначала увеличиваем глобальные тапсы
    const updatedRound = await tx.round.update({
      where: { id: roundId },
      data: { taps: { increment: 1 } },
      select: { taps: true, points: true, startAt: true, endAt: true },
    });

    if (!updatedRound) throw new Error("Round not found");

    if (now < updatedRound.startAt || now > updatedRound.endAt)
      throw new Error("Round not active");

    // Определяем, сколько очков даём за этот тап
    // бонус за каждый 11-й тап
    let pointsToAdd = 1;
    if (updatedRound.taps % 11 === 0) pointsToAdd = 10;

    let userPoints = 0;
    let userTaps = 0;

    if (user.role.toLowerCase() !== "nikita") {
      // Обновляем очки пользователя и его тапсы
      const updatedUser = await tx.roundUser.upsert({
        where: { roundId_userId: { roundId, userId: user.id } },
        update: { taps: { increment: 1 }, points: { increment: pointsToAdd } },
        create: { roundId, userId: user.id, taps: 1, points: pointsToAdd },
      });

      userPoints = updatedUser.points;
      userTaps = updatedUser.taps;
    }

    // Обновляем глобальные очки раунда (только для обычных пользователей)
    if (user.role.toLowerCase() !== "nikita") {
      await tx.round.update({
        where: { id: roundId },
        data: { points: { increment: pointsToAdd } },
      });
    }

    // Пересчёт оставшегося времени
    const nowAfter = new Date();
    const timeLeft = Math.max(
      0,
      Math.floor((updatedRound.endAt.getTime() - nowAfter.getTime()) / 1000)
    );

    return {
      ok: true,
      userPoints,
      totalPoints: updatedRound.points + pointsToAdd, // актуальные глобальные очки
      taps: userTaps,
      timeLeft,
    };
  });
}
