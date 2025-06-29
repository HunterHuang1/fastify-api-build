require("dotenv").config();

async function auth(request, reply) {
  if (["GET", "HEAD"].includes(request.method)) {
    return;
  }

  const apiKey = request.headers["x-api-key"];
  const knownKey = process.env.APIKEY;

  if (!apiKey || apiKey !== knownKey) {
    return reply.status(401).send({ error: "Unauthoried User" });
  }
}

module.exports = auth;
