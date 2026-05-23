import type { FastifyInstance } from "fastify";
import { login, register } from "../controllers/auth.controller";

export default async function authRoutes(fastify: FastifyInstance) {
  fastify.post(
    "/register",
    {
      schema: {
        tags: ["Auth"],
        description: "Registrar um novo usuário",
        body: {
          type: "object",
          required: ["firstName", "lastName", "email", "password"],
          properties: {
            firstName: { type: "string", description: "João" },
            lastName: { type: "string", description: "Silva" },
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
            },
            password: {
              type: "string",
              format: "password",
              description: "Senha do usuário",
            },
            cpf: {
              type: "string",
              description: "CPF do usuário (opcional)",
            },
            birthDate: {
              type: "string",
              format: "date",
              description: "Data de nascimento do usuário (opcional)",
            },
            phone: {
              type: "string",
              description: "Número de telefone do usuário (opcional)",
            },
          },
        },
      },
    },
    register,
  );

  fastify.post(
    "/login",
    {
      schema: {
        tags: ["Auth"],
        description: "Autentica um usuário e retorna um token JWT",
        body: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              description: "Email do usuário",
            },
            password: {
              type: "string",
              format: "password",
              description: "Senha do usuário",
            },
          },
        },
      },
    },
    login,
  );
}
