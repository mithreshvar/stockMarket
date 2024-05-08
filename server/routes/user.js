const express = require('express')

// controller functions
const { loginUser, signupUser, updateWallet} = require('../controllers/userController')
const requireAuth = require('../middleware/requireAuth');

const router = express.Router()

router.post('/login', loginUser)

router.post('/signup', signupUser)

router.use(requireAuth);

router.post('/wallet', updateWallet);

module.exports = router