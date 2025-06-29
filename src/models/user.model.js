const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true,
  },
  lastName: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    selected: false, //hide by default in query
  },
  role: {
    type: String,
    enum: ["Admin", "Product manager", "Team member"],
    default: "Team member",
  },
});

UserSchema.pre("save", async function (next) {
  try {
    if (this.isModified("password") || this.isNew) {
      const salt = await bcrypt.genSalt(10);
      this.password = await bcrypt.hash(this.password, salt);
    }
    next();
  } catch (error) {
    next(error); //pass the error to the next level
  }
});

UserSchema.methods.comparePassword = async function (password) {
  try {
    console.log("the compare passwros are", password, this.password);
    const hashPasswordCompare = await bcrypt.compare(password, this.password);
    return password === this.password || hashPasswordCompare;
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model("User", UserSchema);

module.exports = User;
