import express from "express";
import {
  finishWithGitHub,
  profile,
  startWithGitHub,
  logout,
} from "../controllers/userControllers";
const userRouter = express.Router();

userRouter.get("/profile", profile);
userRouter.get("/start", startWithGitHub);
userRouter.get("/finish", finishWithGitHub);
userRouter.get("/logout", logout);
export default userRouter;
