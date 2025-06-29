const fastify = require("fastify")({logger: true});
const mongoose = require("mongoose");
require("dotenv").config();

//import my routes

const userRoutes = require("./routes/user.routes");
const projectRoutes = require("./routes/project.routes");

//connext dabase

console.log("the current mongodb uri is --- ", process.env.MONGODB_URI);
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

fastify.register(userRoutes, {
  prefix: "/api/v1/users",
});
fastify.register(projectRoutes, {
  prefix: "/api/v1/projects",
});

const start = async () => {
  try {
    //  fastify.listen({ port: process.env.PORT || 5000 });
    // fastify.log.info(
    //   `Server is running on port ${fastify.server.address().port}`
    // );

    await fastify.listen({port: process.env.PORT || 5000});
    fastify.log.info(
      `server is running on port ${fastify.server.address().port}`
    );
  } catch (error) {}
};

start();
