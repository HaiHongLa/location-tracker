const mongoose = require("mongoose");
const HttpError = require("../models/http-error");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/user");

exports.signup = async (req, res, next) => {
  if (!validationResult(req).isEmpty()) {
    return next(
      new HttpError("Invalid inputs passed, please check your data.", 422)
    );
  }

  const { name, email, password } = req.body;

  let existingUser;
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    return next(
      new HttpError("Signing up failed, please try again later.", 500)
    );
  }

  if (existingUser) {
    return next(
      new HttpError("User exists already, please login instead.", 422)
    );
  }

  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 12);
  } catch (err) {
    const error = new HttpError(
      "Could not create user, please try again.",
      500
    );
    return next(error);
  }

  const createdUser = new User({
    name,
    email,
    password: hashedPassword,
    friends: [],
    friendRequests: [],
    location: [],
  });

  try {
    await createdUser.save();
  } catch (err) {
    const error = new HttpError(
      "Signing up failed, please try again later.",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: createdUser.id, email: createdUser.email },
      "secret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    return next(new HttpError("Sign up failed, please try again"));
  }

  res.status(201).json({
    userId: createdUser.id,
    email: createdUser.email,
    token: token,
  });
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Loggin in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  let isValidPassword = false;
  try {
    isValidPassword = await bcrypt.compare(password, existingUser.password);
  } catch (err) {}

  if (!isValidPassword) {
    const error = new HttpError(
      "Could not log you in, please check your credentials and try again",
      500
    );
    return next(error);
  }

  let token;
  try {
    token = jwt.sign(
      { userId: existingUser.id, email: existingUser.email },
      "secret",
      { expiresIn: "1h" }
    );
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Login failed, please try again"));
  }

  res.json({
    userId: existingUser.id,
    email: existingUser.email,
    token: token,
    name: existingUser.name,
  });
};

exports.sendFriendRequest = async (req, res, next) => {
  const { uid, email } = req.body;
  let user;
  try {
    user = await User.findById(uid);
  } catch (err) {
    console.log(err.message);
    err.trace();
    next(new HttpError("An error occured when fetching current user"));
  }

  if (!user) {
    next(new HttpError("An error occured when fetching current user"));
  }

  let friend;

  try {
    friend = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError("An error occured when searching user", 500);
    return next(error);
  }

  if (!friend) {
    res
      .status(404)
      .json({ message: "Could not find user with email " + email });
  } else {
    if (friend.friends.includes(user.id)) {
      res.status(200).json({ message: "User is already friend" });
      return next();
    }
    if (friend.friendRequests.includes(user.id)) {
      res.status(200).json({ message: "Friend request has already been sent" });
      return next();
    }
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      friend.friendRequests.push(user.id);
      await friend.save({ session: sess });
      sess.commitTransaction();
    } catch (err) {
      console.log(err.message);
      return next(new HttpError("Adding friend failed", 500));
    }

    res.status(200).json({ message: "Friend request has been sent" });
  }
};

exports.findUserById = async (req, res, next) => {
  const uid = req.params.uid;
  let user;
  try {
    user = await User.findById(uid).populate("friends", "id name email");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }

  res.json({
    name: user.name,
    email: user.email,
    friends: user.friends,
  });
};

exports.getUserFriendRequests = async (req, res, next) => {
  const uid = req.params.uid;
  let user;

  try {
    user = await User.findById(uid).populate("friendRequests");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }

  const reqIds = user.friendRequests;
  let friendRequests = [];
  for (let index = 0; index < reqIds.length; index++) {
    const reqObj = {
      name: reqIds[index].name,
      email: reqIds[index].email,
      friendId: reqIds[index].id,
    };
    friendRequests.push(reqObj);
  }

  res.status(201).json({ friendRequests: friendRequests });
};

exports.acceptFriendRequest = async (req, res, next) => {
  const { uid, friendId } = req.body;
  let user;

  try {
    user = await User.findById(uid).populate("friendRequests");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }
  const reqIds = user.friendRequests;
  const friend = reqIds.find((friendObj) => friendObj.id === friendId);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.friends.push(friend.id);
    friend.friends.push(user.id);
    user.friendRequests.pull(friend.id);
    await user.save({ session: sess });
    await friend.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Adding friend failed", 500));
  }

  res.json({
    message: "Friend request accepted",
  });
};

exports.denyFriendRequest = async (req, res, next) => {
  const { uid, friendId } = req.body;
  let user;

  try {
    user = await User.findById(uid).populate("friendRequests");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }

  const reqIds = user.friendRequests;
  const friend = reqIds.find((friendObj) => friendObj.id === friendId);

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.friendRequests.pull(friend.id);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Adding friend failed", 500));
  }

  res.status(201).json({ message: "Deny request successful" });
};

exports.unfriend = async (req, res, next) => {
  const { uid, friendId } = req.body;
  let user;

  try {
    user = await User.findById(uid).populate("friends");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }

  const friend = user.friends.find((friendObj) => friendObj.id === friendId);
  if (!friend) {
    return next(new HttpError("Cannot find friend", 500));
  }

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.friends.pull(friend.id);
    friend.friends.pull(user.id);
    await friend.save({ session: sess });
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Unfriend failed", 500));
  }

  res
    .status(201)
    .json({ message: "You and " + friend.name + " are no longer friends" });
};

exports.updateLocation = async (req, res, next) => {
  const { uid, lng, lat, address, createdAt } = req.body;
  const newLoc = {
    address: address,
    lat: lat,
    lng: lng,
    createdAt: createdAt,
  };
  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }
  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    user.location.push(newLoc);
    await user.save({ session: sess });
    sess.commitTransaction();
  } catch (err) {
    console.log(err);
    return next(new HttpError("Update location failed", 500));
  }
  res.status(201).json({ message: "Update location successful" });
};

exports.getUserData = async (req, res, next) => {
  const uid = req.params.uid;
  let user;

  try {
    user = await User.findById(uid)
      .populate("friends", "name email location")
      .populate("friendRequests");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }

  const reqIds = user.friendRequests;
  let friendRequests = [];
  for (let index = 0; index < reqIds.length; index++) {
    const reqObj = {
      name: reqIds[index].name,
      email: reqIds[index].email,
      friendId: reqIds[index].id,
    };
    friendRequests.push(reqObj);
  }

  let userData = {
    userLoc: user.location[user.location.length - 1],
    friends: user.friends,
    friendRequests: friendRequests,
    name: user.name,
    email: user.email,
  };

  res.status(201).json({ message: "Sucess", userData: userData });
};

exports.getLocations = async (req, res, next) => {
  const uid = req.params.uid;
  let user;

  try {
    user = await User.findById(uid).populate("friends", "name email location");
  } catch (err) {
    console.log(err.message);
    return next(new HttpError("Error finding user", 500));
  }

  if (!user) {
    return next(new HttpError("Cannot find user", 500));
  }

  let locations = [
    { name: user.name, loc: user.location[user.location.length - 1] },
  ];
  for (let index = 0; index < user.friends.length; index++) {
    const friend = user.friends[index];
    const locData = {
      name: friend.name,
      loc: friend.location[friend.location.length - 1],
    };
    locations.push(locData);
  }

  res.status(201).json({ message: "Success", locations: locations });
};
