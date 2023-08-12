import express from "express";
import {
  signUp,
  signIn,
  getUserFromDB,
  googleAuthentication,
} from "../controller/auth.controller";
import { getUser } from "../middlewares/auth.middleware";
import validateRequest from "../middlewares/validateRequest.middleware";
import {
  createUserSchema,
  loginSchema,
  googleAuthSchema,
} from "../schema/auth.schema";

const router = express.Router();

router.post("/signup/", validateRequest(createUserSchema), getUser, signUp);
router.post("/signin/", validateRequest(loginSchema), getUser, signIn);

router.post("/getuser", getUser, getUserFromDB);

router.post(
  "/googleAuth",
  validateRequest(googleAuthSchema),
  getUser,
  googleAuthentication
);

export default router;
