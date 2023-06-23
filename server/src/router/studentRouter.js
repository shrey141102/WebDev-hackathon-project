import { Router } from "express";
import { JWT_SECRET } from "../../env.js";
import jwt from "jsonwebtoken";

// ROUTERS
import studentAuthRouter from "./Student/studentAuthRouter.js";
import studentLeaveRouter from "./Student/studentLeaveRouter.js";
import studentComplaintRouter from "./Student/studentComplaintRouter.js";
import studentRoomRouter from "./Student/studentRoomRouter.js";
import studentMessRouter from "./Student/studentMessRouter.js";
import studentInfoRouter from "./Student/studentInfoRouter.js";
import studentEventRouter from "./Student/studentEventRouter.js";
import studentCourseRouter from "./Student/StudentCourseRouter.js";

// Main Router
const mainStudentRouter = Router();

// Merge All Routers
// Path: api/v1/student/auth
mainStudentRouter.use("/auth", studentAuthRouter);

mainStudentRouter.use((req, res, next) => {
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
    if (decoded.role !== "student") {
      return res.status(401).json({
        message: "Invalid Token Login as Student",
      });
    }
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Invalid Token" });
  }
});

mainStudentRouter.use("/me", studentInfoRouter);
mainStudentRouter.use("/leave", studentLeaveRouter);
mainStudentRouter.use("/complaint", studentComplaintRouter);
mainStudentRouter.use("/room-details", studentRoomRouter);
mainStudentRouter.use("/mess-details", studentMessRouter);
mainStudentRouter.use("/course", studentCourseRouter);
mainStudentRouter.use("/event", studentEventRouter);

export default mainStudentRouter;
