import type { FastifyInstance } from "fastify";
import { listProducts } from "../controllers/products.controller";

export default async function productRoutes(fastify: FastifyInstance) {
  fastify.get("/", listProducts);
}