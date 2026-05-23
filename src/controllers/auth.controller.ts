import type { FastifyReply, FastifyRequest } from "fastify";
import type { AuthRequest, RegisterRequest } from "../types";
import { loginUser, registerUser } from "../services/auth.service";

export const register = async (
  request: FastifyRequest,
  reply: FastifyReply,
) => {
  const user = await registerUser(request.body as RegisterRequest);

  const token = request.server.jwt.sign({ userId: user.id });

  reply.status(201).send({
    user,
    token,
  });
};

export const login = async (request: FastifyRequest, reply: FastifyReply) => {
  const user = await loginUser(request.body as AuthRequest);

  const token = request.server.jwt.sign({ userId: user.id });

  reply.send({
    user,
    token,
  });
};
