const express = require("express");
const usersController = require("../controllers/users");

const router = express.Router();

// Network system
router.get("/getUser/:uid", usersController.findUserById);
router.get("/getUserData/:uid", usersController.getUserData);
router.get("/getLocations/:uid", usersController.getLocations);
router.get("/getFriendRequests/:uid", usersController.getUserFriendRequests);
router.post("/friendRequest", usersController.sendFriendRequest);
router.post("/acceptRequest", usersController.acceptFriendRequest);
router.post("/denyRequest", usersController.denyFriendRequest);
router.post("/updateLocation", usersController.updateLocation);
router.delete("/unfriend", usersController.unfriend);

// Authentication
router.post("/signup", usersController.signup);
router.post("/login", usersController.login);

module.exports = router;
