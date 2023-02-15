const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const UserSchema =new mongoose.Schema({
    firstName:{
        type: String,
        required:true,
        // maxlength:[20,'name can not be more than 20 characters'],
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    confirmPassword:{
        type:String,
        required:true,
    }
})


UserSchema.pre("save", async function (next) {
    if (!this.isModified("password")) {
      next();
    }
  
    this.password = await bcrypt.hash(this.password, 10);
  });
  
  //JWT TOKEN
  UserSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, "secret", {
      expiresIn: "5d",
    });
  };
  
  // compare password
  UserSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };

module.exports = mongoose.model('User',UserSchema)