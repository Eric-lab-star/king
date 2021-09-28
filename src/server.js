import "./db";
import express from "express";
import MongoStore from "connect-mongo";
import session from "express-session";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middlewares";

const server = express();

server.set("views", process.cwd() + "/src/views");
server.set("view engine", "pug");
//
server.use(express.urlencoded({ extended: true }));
server.use(
  session({
    resave: false,
    saveUninitialized: false,
    secret: "lksdjfkldsjf",
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
