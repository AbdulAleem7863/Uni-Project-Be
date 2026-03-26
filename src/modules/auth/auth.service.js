import bcrypt from "bcryptjs";
import User from "../../models/user.model.js";
import { generateToken } from "../../utils/jwt.js";

/**
 * Register a new user
 */
export const registerUser = async (userData) => {
  const { email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const error = new Error("Email is already registered");
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    ...userData,
    password: hashedPassword,
  });

  const token = generateToken({ id: user._id, role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token,
    user: userObj,
  };
};


export const loginUser = async (userData) => {
  const { email, password } = userData;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error("Invalid email or password");
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken({ id: user._id, role: user.role });

  const userObj = user.toObject();
  delete userObj.password;

  return {
    token,
    user: userObj,
  };
};
