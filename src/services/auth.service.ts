import { prisma } from "../../lib/prisma";
import type { RegisterRequest } from "../types";

export const registerUser = async (payload: RegisterRequest) => {
  const existingUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (existingUser) {
    throw new Error("Email já está em uso");
  }

  const newUser = await prisma.user.create({
    data: {
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
      password: payload.password,
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
