import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateProduct, ProductFilters } from "../types";
import {
  createProduct,
  getProductById,
  getProducts,
} from "../services/products.service";
import { createProductSchema, productFiltersSchema } from "../utils/validators";
import slugify from "slugify";

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

export const createNewProduct = async (
  request: FastifyRequest<{ Body: CreateProduct }>,
  reply: FastifyReply,
) => {
  const body = request.body;

  body.slug = slugify(body.name, {
    lower: true,
    strict: true,
    locale: "pt",
  });

  const validate = createProductSchema.parse(body);

  await createProduct(validate);

  reply.status(201).send({ message: "Produto criado com sucesso" });
};
