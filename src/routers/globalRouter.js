import express from "express";
import { home } from "../controllers/videoControllers";
import {
  getJoin,
  getLogin,
  postJoin,
  postLogin,
} from "../controllers/userControllers";
const globalRouter = express.Router();

globalRouter.get("/", home);
globalRouter.route("/join").get(getJoin).post(postJoin);
globalRouter.route("/login").get(getLogin).post(postLogin);
export default globalRouter;
