import Fastify, { type FastifyInstance } from "fastify";
import "dotenv/config";
import fastifyCors from "@fastify/cors";
import fastifyCsrf from "@fastify/csrf-protection";
import fastifyHelmet from "@fastify/helmet";
import productRoutes from "./routes/products.routes";
import swagger from "@fastify/swagger";
import scalar from "@scalar/fastify-api-reference";
import jwt from "@fastify/jwt";
import authRoutes from "./routes/auth.routes";
import { errorHandler } from "./middlewares/error.middleware";
import categoryRoutes from "./routes/categories.routes";
import orderRoutes from "./routes/orders.routes";

const PORT = parseInt(process.env.PORT ?? "3000");

export async function buildApp(): Promise<FastifyInstance> {
  const fastify = Fastify({
    logger: {
      level: process.env.LOG_LEVEL || "info",
      serializers: {
        req(request) {
          return {
            method: request.method,
            url: request.url,
          };
        },
        res(reply) {
          return {
            statusCode: reply.statusCode,
          };
        },
      },
    },
  });

  fastify.register(jwt, {
    secret: process.env.JWT_SECRET!,
  });

  fastify.register(fastifyCors, {
    origin: true,
    credentials: true,
  });

  fastify.register(fastifyCsrf);

  fastify.register(fastifyHelmet, {
    contentSecurityPolicy: false,
  });

  fastify.register(swagger, {
    openapi: {
      openapi: "3.0.0",
      info: {
        title: "E-commerce SyntaxWear API",
        description: "API para o e-commerce SyntaxWear",
        version: "1.0.0",
      },
      servers: [
        {
          url: `http://localhost:${PORT}`,
          description: "Servidor de desenvolvimento local",
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
            description: "Autenticação usando JSON Web Tokens (JWT)",
          },
        },
      },
    },
  });

  fastify.register(scalar, {
    routePrefix: "/api-docs",
    configuration: {
      theme: "moon",
    },
  });

  fastify.register(productRoutes, { prefix: "/products" });
  fastify.register(categoryRoutes, { prefix: "/categories" });
  fastify.register(authRoutes, { prefix: "/auth" });
  fastify.register(orderRoutes, { prefix: "/orders" });

  // Declare a route
  fastify.get("/", async (request, reply) => {
    return {
      message: "E-commerce SyntaxWear API",
      version: "1.0.0",
      status: "Running",
    };
  });

  fastify.get("/health", async (request, reply) => {
    return {
      status: "OK",
      timestamp: new Date().toISOString(),
    };
  });

  fastify.setErrorHandler(errorHandler);

  await fastify.ready();

  return fastify;
}
