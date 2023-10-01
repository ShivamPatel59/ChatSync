const express = require("express");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  removeFromGroup,
  addToGroup,
  renameGroup,
} = require("../controllers/chatControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);

//create group
router.route("/group").post(protect, createGroupChat);

//rename group
router.route("/rename").put(protect, renameGroup);

//remove from group
router.route("/groupremove").put(protect, removeFromGroup);

//add from group
router.route("/groupadd").put(protect, addToGroup);

module.exports = router;
