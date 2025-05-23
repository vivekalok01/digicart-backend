import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "All fileds are required", success: false });
    }
    const existingUser =await User.findOne({ email });

    if (existingUser) {
      return res
        .status(404)
        .json({
          message: "User Already exists use another account",
          success: false,
        });
    }
    const hasedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hasedPassword,
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.cookie("token", token, {
      httpOnly: true, // Prevent Javascript to access cookie
      secure: process.env.NODE_ENV === "production", // User secure cookies in proudction
      sameSite: process.env.NODE_ENV == "production" ? "none" : "strict", // CSRF protection
      maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
    });

    return res
      .status(200)
      .json({ success: true, message: "Registred succesfully", user: { email: user.email, name: user.name } });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

export const login = async (req, res) => {
    try {
      const { email, password } = req.body
      if (!email || !password) return res.status(400).json({ success: false, message: "Email and password are required" })
       
      const existingUser = await User.findOne({ email })
      if (!existingUser) return res.status(404).json({ message: 'User not found', success: false })
      const decoded =await bcrypt.compare(password, existingUser.password)
      if (!decoded) return res.status(400).json({ message: "incorrect  password", success: false })
      
      const token = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, { expiresIn: "7d" })
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
        maxAge: 7*24*60*60*1000
      })

      return res.status(200).json({message: 'loggedIn successfully', success:true, user:{email: existingUser.email, name:existingUser.name}})
      
    } catch (error) {
      return res.status(500).json({message: error.message, success:false})
    }
}

export const isAuth = async (req, res) => {
 
       try {
           const userId = req.userId
         const user = await User.findOne({ _id: userId }).select("-password")
      
         return res.status(200).json({success:true, message: "Authorized User", user})
       } catch (error) {
         return res.status(500).json({message: "isauth fails", success:false})
       } 
}

export const logout = async (req, res) => {
    try {
      res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'strict',
        maxAge: 7*24*60*60*1000
      })
      return res.status(200).json({message: "User Loged out succesfully", success:true})
    } catch (error) {
       return res.status(500).json({message: error.message, success:false})
    }
}