const User = require("../models/UserModel");
const mailer = require("../utils/Mailler");
const generateToken = require("../utils/generateToken");
const crypto = require("crypto");
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    // Check if user already exists
    if (userExists) {
      if (userExists.active) {
        return res.status(400).json({
          success: false,
          msg: "User already exists",
        });
      } else {
        return res.status(400).json({
          success: false,
          msg: "Account exists but needs to be activated",
        });
      }
    }

    const user = new User({
      name,
      email,
      password,
    });

    crypto.randomBytes(20, async function (err, buf) {
      if (err) return next(err);
    
      user.activeToken = user._id + buf.toString("hex");
      user.activeExpires = Date.now() + 24 * 3600 * 1000;
    
      const link =
        process.env.NODE_ENV === "development"
          ? `http://localhost:${process.env.PORT}/api/users/active/${user.activeToken}`
          : `${process.env.api_host}/api/users/active/${user.activeToken}`;
    
          mailer.send({
            to: req.body.email,
            subject: "Welcome",
            html: `Please click <a href="${link}"> here </a> to activate your account.`
          });
           
      try {
        await user.save(); // Now using await for saving
        res.status(201).json({
          success: true,
          msg:
            "Account created successfully , Please login",
        });
      } catch (err) {
        return next(err);
      }
    });
    
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      msg: "Server having some issues",
    });
  }
};
const activeToken = async (req, res, next) => {
  try {
    const user = await User.findOne({
      activeToken: req.params.activeToken,
    });

     if (!user) {
      return res.status(400).json({
        success: false,
        msg: "Your activation link is invalid",
      });
    }

     if (user.active) {
      return res.status(200).json({
        success: true,
        msg: "Your account is already active. Please log in to use the app.",
      });
    }

    user.active = true;
    await user.save(); 
    
    return res.status(200).json({
      success: true,
      msg: "Activation successful.",
    });
  } catch (err) {
    next(err);
  }
};

const authUser=async(req,res)=>{
  const{email,password}=req.body;
  
  const user=await User.findOne({email});
  
  console.log("JWT_SECRET:", process.env.JWT_SECRET); // Add this line temporarily

  if(user&&(await user.matchPassword(password))){
    return res.json({
      _id:user.id,
      name:user.name,
      email:user.email,
      avatar:user.avatar,
      token:generateToken(user._id)
    }
  )
  }else{
    return res.status(401).json({
      success:false,
      msg:"Unauthorized user"
      })
  }
}

const getUserProfile=async(req,res)=>{
  const user=await User.findById(req.header._id);
  if(user){
    return res.json({
      _id:user.id,
      name:user.name,
      email:user.email,
      avatar:user.avatar,
      })
      }
      else{
        return res.status(404).json({
          success:false,
          msg:"User not found"
          })
      }
}

const updateUserProfile=async(req,res)=>{
  const user=await User.findById(req.header._id);
  if(user){
    user.name=req.body.name||user.name;
    user.email=req.body.email||user.email;
    user.avatar=req.body.avatar||user.avatar;
 

  const updateUser=await user.save();
  return res.json({
    _id:updateUser._id,
    name:updateUser.name,
    email:updateUser.email,
    avatar:updateUser.avatar,
    token:generateToken(updateUser._id)
    })
   }
   else{
    return res.status(404).json({
      success:false,
      msg:"User not found"
      })
   }
}
module.exports = {
  registerUser,
  activeToken,
  authUser,
  getUserProfile,
  updateUserProfile
};
