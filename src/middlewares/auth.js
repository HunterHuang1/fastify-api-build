const User = require("../models/user.model");

require("dotenv").config();

async function apiKeyAuth(request, reply) {
  if (["GET", "HEAD"].includes(request.method)) {
    return;
  }

  const apiKey = request.headers["x-api-key"];
  const knownKey = process.env.APIKEY;

  if (!apiKey || apiKey !== knownKey) {
    return reply.status(401).send({ error: "Unauthoried User" });
  }
}

async function basicAuth(request, reply) {
  if (["GET", "HEAD"].includes(request.method)) {
    return;
  }
  const authHeader =
    request.headers["authorization"] || request.headers["Authorization"];

  if (!authHeader) {
    return reply.status(401).send({
      message: "No Auth Header",
    });
  }

  const [authType, authKey] = authHeader.split(" ");
  if (authType !== "Basic") {
    return reply.status(401).send({
      message: "Require Basice Auth process(email&password)",
    });
  }

  const [email, password] = Buffer.from(authKey, "base64")
    .toString("ascii")
    .split(":");

  try {
    //So even though .select: false hides it by default, your .select("password") overrides that and tells Mongoose:
    const user = await User.findOne({ email }).select("password");

    if (!user) {
      return reply.status(401).send({
        message: "No such Email found",
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return reply.status(401).send({
        message: "No such Password found",
      });
    }
  } catch (error) {
    reply.status(401).send({
      message: "Error during authorization",
    });
  }
}

async function login(request, reply, fastify) {
  const { email, password } = request.body;

  const user = await User.findOne({ email }).select([
    "password",
    "firstName",
    "lastName",
    "role",
  ]);

  if (!user) {
    return reply.status(401).send({
      message: "No such Email found",
    });
  }

  const isMatch = await user.comparePassword(password);

  if (!isMatch) {
    return reply.status(401).send({
      message: "No such Password found",
    });
  }

  //if valid -> sign a token
  const token = fastify.jwt.sign({
    //token structure
    payload: {
      email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
    },
  });

  reply.send({ token }); //based on the paylod email/password, get the token, which contains the info
}

module.exports = { apiKeyAuth, basicAuth, login };
