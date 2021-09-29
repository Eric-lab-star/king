import "./db";
import express from "express";
import globalRouter from "./routers/globalRouter";
import videoRouter from "./routers/videoRouter";
import session from "express-session";
import MongoStore from "connect-mongo";
import { localsMiddleware } from "./middleware";
import userRouter from "./routers/userRouter";
const server = express();

server.set("views", process.cwd() + "/src/views");
server.set("view engine", "pug");
//
server.use(express.urlencoded({ extended: true }));
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "sdfdsf",
    store: MongoStore.create({ mongoUrl: "mongodb://127.0.0.1:27017/king" }),
  })
);
server.use(localsMiddleware);
//
server.use("/", globalRouter);
server.use("/videos", videoRouter);
server.use("/users", userRouter);
server.listen(4000, () =>
  console.log("server is listeing to http://localhost:4000 ")
);
