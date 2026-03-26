import { Router } from "express";
import { register, login, logout } from "./auth.controller.js";
import { catchAsync } from "../../middlewares/catchAsync.middleware.js";

const router = Router();

router.post("/register", catchAsync(register));
router.post("/login", catchAsync(login));
router.post("/logout", logout);

export default router;
