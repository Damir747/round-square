import bcrypt from "bcrypt";
import { FastifyInstance } from "fastify";
import { signToken, verifyToken } from "../utils/jwt";

export default async function authRoutes(fastify: FastifyInstance) {
  // LOGIN
  fastify.post("/login", async (req, reply) => {
    const { username, password } = req.body as {
      username?: string;
      password?: string;
    };

    if (!username || !password) {
      reply.code(400).send({ error: "Missing username or password" });
      return;
    }

    // ищем пользователя в базе
    let user = await fastify.prisma.user.findUnique({ where: { username } });

    // если нет — создаём
    if (!user) {
      const hash = await bcrypt.hash(password, 10);
      let role = "survivor";
      if (username === "admin") role = "admin";
      if (username.toLowerCase() === "никита") role = "nikita";

      user = await fastify.prisma.user.create({
        data: { username, password: hash, role },
      });
    } else {
      // проверяем пароль
      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        reply.code(401).send({ error: "Invalid password" });
        return;
      }
    }

    // создаём JWT
    const token = signToken({
      id: user.id,
      role: user.role,
      username: user.username,
    });

    // отправляем cookie
    reply
      .setCookie("token", token, {
        httpOnly: true,
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 дней
      })
      .send({ ok: true });
  });

  // ME endpoint — получить данные о текущем пользователе
  fastify.get("/me", async (req, reply) => {
    const token = req.cookies?.token || null;

    if (!token) {
      reply.code(401).send({ error: "Not authenticated" });
      return;
    }

    const data = verifyToken<{ id: number; role: string; username: string }>(
      token
    );

    if (!data) {
      reply.code(401).send({ error: "Invalid token" });
      return;
    }

    const user = await fastify.prisma.user.findUnique({
      where: { id: data.id },
      select: { id: true, username: true, role: true, createdAt: true },
    });

    reply.send({ user });
  });

  // LOGOUT
  fastify.post("/logout", async (req, reply) => {
    reply.clearCookie("token", { path: "/" }).send({ ok: true });
  });
}
