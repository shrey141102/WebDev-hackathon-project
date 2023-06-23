import { Router } from "express";
import facultyAuthRouter from "./Faculty/facultyAuthRouter.js";
import facultyEventRouter from "./Faculty/facultyEventRouter.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../env.js";
import facultyCourseRouter from "./Faculty/facultyCourseRouter.js";

const mainFacultyRouter = Router();

mainFacultyRouter.use("/auth", facultyAuthRouter);

mainFacultyRouter.use((req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      message:
        "Please add authentication token in the Authorization Header: 'Bearer <TOKEN>'",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      message:
        "Please add authentication token in the Authorization Header: 'Bearer <TOKEN>'",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    if (decoded.role !== "faculty") {
      return res.status(401).json({
        message: "Invalid Token Login as Faculty",
      });
    }
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Invalid Token" });
  }
});

mainFacultyRouter.use("/event", facultyEventRouter);
mainFacultyRouter.use("/course", facultyCourseRouter);

export default mainFacultyRouter;
