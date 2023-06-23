import { Router } from "express";
import {
  studentAuthLoginSchema,
  studentAuthRegisterSchema,
} from "../../schema/student_auth.js";
import prisma from "../../db.js";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../env.js";
import bcrypt from "bcrypt";

// Path: api/v1/student/auth/[login, register]
const studentAuthRouter = Router();

// Path: api/v1/student/auth/register
// Params: { name, regNo, block, password, roomNo }
// Returns: { message, student }
// Error: { message, error }
studentAuthRouter.post("/register", async (req, res) => {
  const { name, regNo, block, password, roomNo } = req.body;

  try {
    const validStudent = studentAuthRegisterSchema.parse({
      name,
      regNo,
      block,
      password,
      roomNo,
    });

    const hashedPass = await bcrypt.hash(validStudent.password, 10);

    const student = await prisma.student.create({
      data: {
        name: validStudent.name,
        regNo: validStudent.regNo,
        block: validStudent.block,
        password: hashedPass,
        roomNo: "",
      },
      select: {
        block: true,
        name: true,
        regNo: true,
        id: true,
      },
    });

    /* #swagger.responses[200] = {
        description: 'User successfully obtained.',
        schema: {
            message: 'Success',
            data: {
                block: "A",
                name: "John Doe",
                regNo: "19BCE0000",
                id: 1
              }
        }
} */

    res.status(201).json({
      message: "Student Registered",
      student,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      message: "Invalid Student",
      error: e,
    });
    return;
  }
});

// Path: api/v1/student/auth/login
// Params: { regNo, password }
// Returns: { message, data, token? }
// Error: { message, error }
studentAuthRouter.post("/login", async (req, res) => {
  const { regNo, password } = req.body;

  try {
    const validStudent = studentAuthLoginSchema.parse({
      regNo,
      password,
    });

    const student = await prisma.student.findUnique({
      where: {
        regNo: validStudent.regNo,
      },
    });

    if (!student) {
      return res.status(404).json({
        message:
          "Student not found, please register first or enter valid credentials",
        data: null,
      });
    }

    if (bcrypt.compareSync(validStudent.password, student.password) === false) {
      return res.status(400).json({
        message: "Invalid password",
        data: null,
      });
    }

    const access_token = jwt.sign(
      {
        id: student.id,
        regNo: student.regNo,
        name: student.name,
        block: student.block,
        role: "student",
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    delete student.password;

    /* #swagger.responses[200] = {
        description: 'Student successfully logged in.',
        schema: {
    "message": "Logged in successfully",
    "data": {
        "id": 1,
        "name": "John Wick",
        "regNo": "21BPS1390",
        "block": "A",
        "roomNo": "A-102",
        "messType": "Special",
        "toBeChangedTo": "",
        "isForChange": false,
        "roomId": 3
    },
    "token": ""
}
} */
    return res.status(200).json({
      message: "Logged in successfully",
      data: student,
      token: access_token,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: "Invalid Student Details",
      error: e,
    });
  }
});

export default studentAuthRouter;
