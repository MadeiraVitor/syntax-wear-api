import type { FastifyReply, FastifyRequest } from "fastify";
import type { ProductFilters } from "../types";
import { getProductById, getProducts } from "../services/products.service";
import { productFiltersSchema } from "../utils/validators";

export const listProducts = async (
  request: FastifyRequest<{ Querystring: ProductFilters }>,
  reply: FastifyReply,
) => {
  const filters = productFiltersSchema.parse(request.query);
  const result = await getProducts(filters as ProductFilters);
  reply.send(result);
};

export const getProduct = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const product = await getProductById(Number(request.params.id));
  reply.status(200).send(product);
};
