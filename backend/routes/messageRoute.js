const express = require('express');
const { getChatMessages, sendMessage } = require('../controllers/messageControllers');
const auth = require('../middleware/authMiddleware');


const router = express.Router();

router.get('/:chatId', auth, getChatMessages);
router.post('/', auth, sendMessage);

module.exports = router;