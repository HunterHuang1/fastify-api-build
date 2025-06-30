const fastify = require("fastify")({ logger: true });
const mongoose = require("mongoose");
require("dotenv").config();
const jwtPlugin = require("./plugins/jwtPlugin");

//import my routes

const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");
const auth = require("./middlewares/auth");

//connext dabase

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((e) => {
    console.log("Error connecting to database", e);
  });

//start server

//can decorate inside the fastify-plugin, if can access the fastify instance
// fastify.register(require("@fastify/jwt"), {
//   secret: process.env.JWT_SIGNING_SECRET,
// });
//register before the routes
fastify.register(jwtPlugin);

fastify.register(userRoutes, {
  prefix: "/api/v1/users",
});
fastify.register(projectRoutes, {
  prefix: "/api/v1/projects",
});

//can also add in routes side for each route
fastify.addHook("preHandler", auth.basicAuth);

const start = async () => {
  try {
    //  fastify.listen({ port: process.env.PORT || 5000 });
    // fastify.log.info(
    //   `Server is running on port ${fastify.server.address().port}`
    // );

    await fastify.listen({ port: process.env.PORT || 5000 });
    fastify.log.info(
      `server is running on port ${fastify.server.address().port}`
    );
  } catch (error) {}
};

start();
