const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

exports.getAllNotes = async (req, res, next) => {
  const uid = req.params.uid;
  let user;

  try {
    user = await User.findById(uid).populate("friends", "name email notes");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }

  let result = [
    {
      name: user.name,
      email: user.email,
      notes: user.notes,
    },
  ];
  for (let index = 0; index < user.friends.length; index++) {
    const friend = user.friends[index];
    const data = {
      name: friend.name,
      email: friend.email,
      note: friend.notes,
    };
    result.push(data);
  }

  res.status(201).json({ message: "Success", notes: result });
};

exports.createNote = async (req, res, next) => {};

exports.updateNote = async (req, res, next) => {};

exports.deleteNote = async (req, res, next) => {};