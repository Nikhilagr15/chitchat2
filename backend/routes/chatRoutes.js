const express = require('express');
const auth = require('../middleware/authMiddleware');
const { accessChat, fetchChats, groupChatCreate } = require('../controllers/chatControllers');

const router = express.Router();

router.post("/:userId", auth, accessChat)
router.get("/", auth, fetchChats)
router.post("/group", auth, groupChatCreate)

module.exports = router;
