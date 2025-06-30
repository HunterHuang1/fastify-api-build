const fp = require("fastify-plugin");

const jwtPlugin = fp(async function (fastify, options) {
  //access That’s the key used to:
  // 🔏 Sign the token (so you know it’s from your server)
  // ✅ Verify the token (to ensure it's untampered)
  fastify.register(require("@fastify/jwt"), {
    secret: process.env.JWT_SIGNING_SECRET,
  });

  fastify.decorate("jwtAuth", async function (request, reply) {
    try {
      await request.jwtVerify();
    } catch (error) {
      reply.status(401).send({
        message: "JWT Unauthoried",
      });
    }
  });

  fastify.decorate("jwtRole", function (role) {
    return async function (request, reply) {
      const userRole = request.user.payload.role; // ✅ fix here

      if (role !== userRole) {
        reply.status(401).send({
          message: "Forbidden user role",
        });
      }
    };
  });
});

module.exports = jwtPlugin;
