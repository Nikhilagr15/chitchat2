const express = require('express');
const { registerUser, loginUser, getAllUsers } = require('../controllers/userControllers');
const auth = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', auth, getAllUsers);
router.route('/register').post(registerUser)            //to chain multiple method
router.post('/login', loginUser)                        // can't chain another method

module.exports = router;