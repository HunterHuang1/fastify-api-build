const User = require("../models/user.model");

async function getAllUsers(request, reply) {
  try {
    const users = await User.find();
    reply.send(users);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function getUserById(request, reply) {
  try {
    const user = await User.findById(request.params.id);
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function createUser(request, reply) {
  try {
    const user = new User(request.body);
    const result = await user.save();
    console.log("the created one is --- ", result);
    reply.code(201).send(result);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function updateUser(request, reply) {
  try {
    const user = await User.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
    });
    reply.send(user);
  } catch (error) {
    reply.status(500).send(error);
  }
}

async function deleteUser(request, reply) {
  try {
    await User.findByIdAndDelete(request.params.id);
    reply.status(204).send("");
  } catch (error) {
    reply.status(500).send(error);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
