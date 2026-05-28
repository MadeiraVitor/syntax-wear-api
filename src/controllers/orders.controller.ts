import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateOrder, OrderFilters, UpdateOrder } from "../types";
import {
  createOrder,
  getOrderById,
  getOrders,
  updateOrder,
} from "../services/orders.service";
import {
  createOrderSchema,
  orderFiltersSchema,
  updateOrderSchema,
} from "../utils/validators";

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

export const createNewOrder = async (
  request: FastifyRequest<{ Body: CreateOrder }>,
  reply: FastifyReply,
) => {
  const body = request.body;
  const validate = createOrderSchema.parse(body);
  const order = await createOrder(validate);

  reply
    .status(201)
    .send({ message: "Pedido criado com sucesso", orderId: order.id });
};

export const updateExistingOrder = async (
  request: FastifyRequest<{ Params: { id: string }; Body: UpdateOrder }>,
  reply: FastifyReply,
) => {
  const { id } = request.params;
  const body = request.body;
  const validate = updateOrderSchema.parse(body);

  const order = await updateOrder(Number(id), validate);

  reply.status(200).send(order);
};
