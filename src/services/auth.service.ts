import { prisma } from "../utils/prisma";
import type { AuthRequest, RegisterRequest } from "../types";
import bcrypt from "bcrypt";
import { FastifyReply } from "fastify";
import { OAuth2Client } from "google-auth-library";

export const registerUser = async (payload: RegisterRequest, reply: FastifyReply) => {
  const existingUser = await prisma.user.findFirst({
    where: { 
      OR: [{ email: payload.email }, { cpf: payload.cpf }],
    },
  });

  if (existingUser) {
    if (existingUser.email === payload.email) {
      return reply.status(409).send({ message: "Email já está em uso" });
    }

    if (existingUser.cpf === payload.cpf) {
      return reply.status(409).send({ message: "CPF já cadastrado" });
    }
  }

  const hashedPassword = await bcrypt.hash(payload.password, 10);

  const newUser = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: hashedPassword,
      role: "USER",
      ...(payload.cpf !== undefined ? { cpf: payload.cpf } : {}),
      ...(payload.phone !== undefined ? { phone: payload.phone } : {}),
      ...(payload.birthDate !== undefined
        ? { birthDate: new Date(payload.birthDate) }
        : {}),
    },
  });
  const { password, ...userWithoutPassword } = newUser;

  return userWithoutPassword;
};

export const loginUser = async (data: AuthRequest, reply: FastifyReply) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    reply.status(409).send({ message: "As credenciais estão incorretas" });
    return;
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    reply.status(409).send({ message: "As credenciais estão incorretas" });
    return;
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const loginWithGoogle = async (
  credential: string,
  reply: FastifyReply,
) => {
  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    reply.status(401).send({ message: "Token do Google inválido" });
    return;
  }

  const { email, given_name, family_name } = payload;

  let user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    user = await prisma.user.create({
      data: {
        firstName: given_name || "",
        lastName: family_name || "",
        email,
        password: "",
        role: "USER",
      },
    });
  }

  const { password, ...userWithoutPassword } = user;

  return userWithoutPassword;
};
