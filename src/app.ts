// Require the framework and instantiate it

// ESM
import Fastify from "fastify";
import "dotenv/config";
import fastifyCors from "@fastify/cors";
import fastifyHelmet from "@fastify/helmet";
import productRoutes from "./routes/products.routes";

const PORT = parseInt(process.env.PORT ?? "3000");

const fastify = Fastify({
  logger: true,
});

fastify.register(fastifyCors, {
  origin: true,
  credentials: true,
});

fastify.register(fastifyHelmet, {
  contentSecurityPolicy: false,
});

fastify.register(productRoutes, { prefix: "/products" });

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

// Run the server!
fastify.listen({ port: PORT }, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});

export default fastify;
