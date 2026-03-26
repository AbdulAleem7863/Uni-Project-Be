import { ZodError } from "zod";
import { registerUser, loginUser } from "./auth.service.js";
import { registerSchema, loginSchema } from "./auth.schema.js";
import { successResponse, errorResponse } from "../../utils/response.js";

export const register = async (req, res, next) => {
  try {
    const validatedData = registerSchema.parse(req.body);
    const { token, user } = await registerUser(validatedData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return successResponse(res, 201, "Registration successful", { user, token });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(res, 400, "Validation Error", error.flatten().fieldErrors);
    }
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    const validatedData = loginSchema.parse(req.body);
    const { token, user } = await loginUser(validatedData);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return successResponse(res, 200, "Login successful", { user, token });
  } catch (error) {
    if (error instanceof ZodError) {
      return errorResponse(res, 400, "Validation Error", error.flatten().fieldErrors);
    }
    next(error);
  }
};

export const logout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return successResponse(res, 200, "Logged out successfully");
  } catch (error) {
    next(error);
  }
};
