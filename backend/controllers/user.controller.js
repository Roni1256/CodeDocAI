import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { transportMail } from "../utils/mail.js";

//--------------Registration
export async function register(req, res) {
  const { username, email, password } = req.body;
  try {
    if (!username || !email || !password)
      return res.status(400).json({ message: "Missing Credentials!" });

    const isUserExist = await User.findOne({ email: email });

    if (isUserExist)
      return res.status(409).json({ message: "User Already Exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationCode = crypto.randomInt(100000, 999999).toString();
    const codeExpire = Date.now() + 10 * 60 * 1000;
    const user = new User({
      username,
      email,
      password: hashedPassword,
      verificationCode,
      codeExpiry: codeExpire,
      isVerified: false,
    });
    await user.save();

    await transportMail(email, username, verificationCode);

    return res.status(201).json({
      message: "User Registered. Verification Code sent to mail!",
      email,
      username,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error",
      error,
      email,
      username,
      password,
    });
  }
}
//----------Code Verification--------
export async function verification(req, res) {
  try {
    const { email, code } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified) {
      return res.status(400).json({ message: "Already verified" });
    }
    if (user.verificationCode !== code || user.codeExpiry < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired code" });
    }

    user.isVerified = true;
    user.verificationCode = undefined;
    user.codeExpiry = undefined;

    await user.save();

    const token = jwt.sign(
      { id: user._id, verified: true },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("codeDocToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(201)
      .json({ message: "User Created Successfully! Logged in successfully!" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}

export async function resendCode(req, res) {
  try {
    const { email, username } = req.body;
    const verificationCode = crypto.randomInt(100000, 999999).toString();

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(400).json({ message: "User Not Found!" });
    }
    user.verificationCode = verificationCode;
    const codeExpire = Date.now() + 10 * 60 * 1000;

    user.codeExpiry = codeExpire;
    user.save();

    await transportMail(email, username, verificationCode);
  } catch (error) {}
}

export async function getCurrentUser(req, res) {
  try {
    const { codeDocToken } = req.cookies;
    console.log(codeDocToken);
    if (!codeDocToken) {
      return res.status(400).json({ message: "Not Authorized" });
    }
    const decoded = jwt.verify(codeDocToken, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ error: "Not authorized:Invalid token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(401).json({ error: "User not found" });
    }

    return res.status(200).json({message:"User retrieved",user})
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
export async function login(req,res) {
  try {
    const {email,password}=req.body;
    if(!email || !password) return res.status(401).json({message:"Missing Credentials"})

    const user=await User.findOne({email:email})
    if(!user){
      return res.status(404).json({message:"User not found"});
    }
    const isPasswordMatch=await bcrypt.compare(password,user.password);
    if(!isPasswordMatch){
      return res.status(401).json({message:"Password Mismatch"});
    }
    const returningObj={
      email:user.email,
      username:user.username,
      id:user._id
    }
    const jwtToken=jwt.sign({id:user._id},process.env.JWT_SECRET,{expiresIn:"30d"})
    res.cookie("codeDocToken",jwtToken,{
     httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 30 * 24 * 60 * 60 * 1000,
    })
    return res.status(200).json({message:"Login success",returningObj})
  } catch (error) {
    return res.status(500).json({message:"Internal Server Error"})
  }
}

export async function logout(req, res) {
  try {
    res.clearCookie("codeDocToken", {
      httpOnly: true,
      secure: true, 
      sameSite: "none", 
    });

    return res.status(200).json({ message: "Logout successful!" });
  } catch (error) {
    return res.status(500).json({ message: "Server error!" });
  }
}