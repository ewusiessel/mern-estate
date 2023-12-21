// Desc: Controller for authentication

import User from "../models/user.model.js";
import bycrypt from "bcryptjs"; // for hashing password
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

export const signup = async (req, res, next) => {
  // create new user
  const { username, email, password, roles } = req.body;
  const hashedPassword = await bycrypt.hash(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });
  try {
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    next(error);
  }
};

export const signin = async (req, res, next) => {
  // create login user
  const { email, password } = req.body;
  try {
    const validUser = await User.findOne({ email }); // check if user exists
    if (!validUser) {
      return next(errorHandler(404, "User not found!")); // if user does not exist
    }

    const validPassword = bycrypt.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(401, "Wrong credentials!")); // if password is incorrect
    }
    try {
      const token = jwt.sign({ id: validUser._id }, process.env.JWT_SECRET); // create token
      const { password: pass, ...rest } = validUser._doc; // remove password from user data before sending
      res
        .cookie("access_token", token, { httpOnly: true }) // set cookie
        .status(200) // send response
        .json(rest); // send user data
    } catch (error) {
      next(error);
    }
  } catch (error) {
    next(error);
  }
};
