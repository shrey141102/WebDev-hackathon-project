import { Router } from "express";
import { JWT_SECRET } from "../../env.js";
import jwt from "jsonwebtoken";

import wardenAuthRouter from "./Warden/wardenAuthRouter.js";
import wardenLeaveRouter from "./Warden/wardenLeaveRouter.js";
import wardenComplaintRouter from "./Warden/wardenComplaintRouter.js";
import wardenRoomRouter from "./Warden/wardenRoomRouter.js";
import wardenMessRouter from "./Warden/wardenMessRouter.js";
import wardenInfoRouter from "./Warden/wardenInforRouter.js";
import wardenStudentRouter from "./Warden/wardenStudentRouter.js";

const mainWardenRouter = Router();

mainWardenRouter.use("/auth", wardenAuthRouter);

mainWardenRouter.use((req, res, next) => {
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
    if (decoded.role !== "warden") {
      return res.status(401).json({
        message: "Invalid Token Login as Warden",
      });
    }
    req.user = decoded;
    next();
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "Invalid Token" });
  }
});

mainWardenRouter.use("/me", wardenInfoRouter);
mainWardenRouter.use("/leave", wardenLeaveRouter);
mainWardenRouter.use("/complaint", wardenComplaintRouter);
mainWardenRouter.use("/room-details", wardenRoomRouter);
mainWardenRouter.use("/mess-details", wardenMessRouter);
mainWardenRouter.use("/student", wardenStudentRouter);

export default mainWardenRouter;
