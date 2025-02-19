const express = require("express");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  getNewUsers,
} = require("../controllers/userController");

const router = express.Router();

router.route("/").post(createUser).get(getUsers);
router.route("/students/new").get(getNewUsers);
router.route("/:id").get(getUserProfile).put(updateUser).delete(deleteUser);
// router.route("/profile/:userId").get(getUserProfile);

module.exports = router;
