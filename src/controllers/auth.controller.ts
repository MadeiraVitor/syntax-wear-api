import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthRequest, RegisterRequest } from "../types";
import { loginUser, registerUser } from "../services/auth.service";
import { loginSchema, registerSchema } from "../utils/validators";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const validation = registerSchema.parse(request.body as RegisterRequest);

  const user = await registerUser(validation);

  const token = request.server.jwt.sign({ userId: user.id });

  reply.status(201).send({
    user,
    token,
  });
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const validation = loginSchema.parse(request.body as AuthRequest);

  const user = await loginUser(validation);

  const token = request.server.jwt.sign({ userId: user.id });

  reply.setCookie("syntaxwear.token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24, // 1 dia
  });

  reply.status(200).send({
    user
  });
};

export const profile = async (request: FastifyRequest, reply: FastifyReply) => reply.send(request.user);