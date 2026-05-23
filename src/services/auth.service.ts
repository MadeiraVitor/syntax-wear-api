import { prisma } from "../../lib/prisma";
import type { AuthRequest, RegisterRequest } from "../types";
import bcrypt from "bcrypt";

export const registerUser = async (payload: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Email já está em uso");
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

  return newUser;
};

export const loginUser = async (data: AuthRequest) => {
  const user = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (!user) {
    throw new Error("Usuário não encontrado");
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    throw new Error("Senha incorreta");
  }

  return user;
};
