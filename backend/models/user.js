const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true, minlength: 6 },
  friends: [{ type: mongoose.Types.ObjectId, required: true, ref: "User" }],
  friendRequests: [
    { type: mongoose.Types.ObjectId, required: true, ref: "User" },
  ],
  location: [{
    address: { type: String },
    lat: { type: Number },
    lng: { type: Number },
    createdAt: { type: Date },
  }],
});

userSchema.plugin(uniqueValidator);
module.exports = mongoose.model("User", userSchema);
