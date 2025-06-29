const userController = require("../controllers/user.controller");
const auth = require("../middlewares/auth");

//the routes works as plugins for fastify to register
async function routes(fastify, options) {
  fastify.get("/", userController.getAllUsers);
  fastify.get("/:id", userController.getUserById);
  fastify.post("/", { preHandler: auth.basicAuth }, userController.createUser);
  fastify.put("/:id", userController.updateUser);
  fastify.delete("/:id", userController.deleteUser);
}

module.exports = routes;
