import express from "express";
import {
  getEdit,
  getProfile,
  postEdit,
  logout,
  start,
  finish,
} from "../controllers/userControllers";

const userRouter = express.Router();

userRouter.get("/:id([0-9a-f]{24})", getProfile);
userRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
userRouter.get("/logout", logout);
userRouter.get("/start", start);
userRouter.get("/finish", finish);
export default userRouter;
