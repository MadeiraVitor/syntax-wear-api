import type { FastifyReply, FastifyRequest } from "fastify";
import type { OrderFilters } from "../types";
import { getOrderById, getOrders } from "../services/orders.service";
import { orderFiltersSchema } from "../utils/validators";

export const listOrders = async (
  request: FastifyRequest<{ Querystring: OrderFilters }>,
  reply: FastifyReply,
) => {
  const filters = orderFiltersSchema.parse(request.query);
  const result = await getOrders(filters as OrderFilters);
  reply.send(result);
};

export const getOrder = async (
  request: FastifyRequest<{ Params: { id: string } }>,
  reply: FastifyReply,
) => {
  const order = await getOrderById(Number(request.params.id));
  reply.status(200).send(order);
};
