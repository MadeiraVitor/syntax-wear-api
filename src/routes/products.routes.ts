import type { FastifyInstance } from "fastify";
import { listProducts } from "../controllers/products.controller";
import { authenticate } from "../middlewares/auth.middleware";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.addHook("onRequest", authenticate);
  fastify.get(
    "/",
    {
      schema: {
        tags: ["Products"],
        description: "Lista produtos com filtros opcionais",
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", description: "Página" },
            limit: { type: "number", description: "Itens por página" },
            minPrice: { type: "number", description: "Preço mínimo" },
            maxPrice: { type: "number", description: "Preço máximo" },
            search: { type: "string", description: "Busca por nome/descrição" },
            sortBy: {
              type: "string",
              enum: ["price", "name", "createdAt"],
              description: "Campo de ordenação",
            },
            sortOrder: {
              type: "string",
              enum: ["asc", "desc"],
              description: "Ordem",
            },
          },
        },
      },
    },
    listProducts,
  );
}