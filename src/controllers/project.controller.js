const Project = require("../models/project.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");

async function createProject(request, reply) {
  try {
    const projectManager = await User.findById(request.body.projectManager);
    if (
      !projectManager ||
      !["Admin", "Product manager"].includes(projectManager.role)
    ) {
      return reply.status(400).send({message: "Invalid Product manager"});
    }

    //verfy that the team members exist
    //and send reply if one of them is wrong
    for (let memberId of request.body.teamMembers) {
      const teamMember = await User.findById(memberId);
      if (!teamMember) {
        return reply
          .status(400)
          .send({message: `Invalid team member: ${memberId}`});
      }
    }

    const project = new Project(request.body);
    const result = await project.save();
    reply.send(result);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function getAllProjects(request, reply) {
  try {
    const projects = await Project.find()
      .populate(
        //populate will add the firstName.... to the projetmanager as obj
        "projectManager",
        "firstName lastName email"
      )
      .populate("teamMembers", "firstName lastName email role");
    reply.send(projects);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function getProjectById(request, reply) {
  try {
    if (!mongoose.isValidObjectId(request.params.id)) {
      return reply.code(400).send({message: "Invalid project ID format"});
    }

    const project = await Project.findById(request.params.id);

    if (!project) {
      return reply
        .status(404)
        .send({message: "Project with that id not found"});
    }

    reply.send(project);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function updateProject(request, reply) {
  try {
    const project = await Project.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
      }
    );
    reply.send(project);
  } catch (error) {
    reply.status(400).send(error);
  }
}

async function deleteProject(request, reply) {
  try {
    await Project.findByIdAndDelete(request.params.id);
    reply.status(202).send({message: "Success Deleted"});
  } catch (error) {
    reply.status(400).send(error);
  }
}

module.exports = {
  createProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
