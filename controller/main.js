const User = require('../model/main');
const {body,validationResult}=require('express-validator');
const asyncWrapper = require('../middleware/async');
const sendEmail = require("../utils/sendEmail");
const sendToken = require("../utils/jwtToken");
const jwt = require("jsonwebtoken");


const createUser =([
    body('firstName').isLength({min : 3}),
    body('lastName').isLength({min : 3}),
    body('email').isEmail(),
    body('password').isLength({min : 5}),
    body('confirmPassword').isLength({min : 5}),

],(async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const {firstName,lastName,email,password,confirmPassword}= req.body
    const adduser = new User({
        firstName,lastName,email,password,confirmPassword
    })
    await adduser.save()
    // res.status(200).json(adduser);
    console.log(adduser);


    try {
        await sendEmail({
          email: adduser.email,
          subject: "BellHopt Verification",
          text: `
            Hello, thanks for registering on Our site 
          `,
          html: `
            <h1>Hello,</h1>
            <p>Thanks for registering on site</p>
          `,
        });
        res.status(200).json({
          message: `Thanks for registering. Please check your email to verify your account`,
        });
      } catch (error) {
        console.log(error);
      }
    
      sendToken(adduser, 201, res);
})
)

const loginUser =async (req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }

const { email, password } = req.body;
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return res.status(400).json({message:"you are not registered"});
  }

  const isPasswordMatched = await user.comparePassword(password);
  console.log(isPasswordMatched);

  if (!isPasswordMatched) {
    return res.status(400).json({message:"Please enter valid email and password"});
  }
  else
  {
    return res.status(200).json({message:"you are logged in successfully"});
  }
}





const forgotPassword = async (req, res) => {
    const { email } = req.body;
  
    const user = await User.findOne({ email });
  
    const passwordResetToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: Math.floor(Date.now() / 1000) + 60 * 10,
      }
    );
  
    if (user) {
      try {
        user.passwordResetToken = passwordResetToken;
        await user.save();
  
        // send Email function call
        await sendEmail({
          email: user.email,
          subject: "Password Reset",
          text: `
             
            Click on the URL below to reset your password
            ${req.headers.user}/resetpassword/${passwordResetToken}
          `,
          html: `
            <p>Click on the URL below to reset your password</p>
            <a href="http://${req.headers.user}/resetpassword/${passwordResetToken}">Click here to reset password</a>
          `,
        });
  
        res.status(200).json({
          message: `A password reset has been sent to your Email`,
        });
      } catch (error) {
        console.log(error);
      }
    }
  };
  
  const resetpassword = async (req, res) => {
  
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()});
    }
    const { passwordResetToken } = req.params;
  
    const { newPassword } = req.body;
  
    const { id } = jwt.verify(passwordResetToken, process.env.JWT_SECRET);
  
    const user = await User.findById(id);
  
    if (user) {
      user.password = newPassword;
      await user.save();
    } else {
      res.status(400).json({message:"Invalid password Reset Token"});
    }
  
    res.status(200).json({ success: true, msg: "password Reset Successfully" });
  };





module.exports={
    createUser,loginUser,forgotPassword,resetpassword
    // ,home
}