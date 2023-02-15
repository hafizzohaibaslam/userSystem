const express = require('express')
const router = express.Router()

const {createUser,loginUser,forgotPassword,resetpassword} = require('../controller/main');


router.post('/register',createUser);
router.post('/login',loginUser);
router.post('/forget',forgotPassword);
router.post('/reset',resetpassword);



module.exports = router;