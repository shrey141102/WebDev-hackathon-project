import { Router } from "express";
import {
  facultyCreateDetails,
  facultyLoginDetails,
} from "../../schema/faculty_auth.js";
import prisma from "../../db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../../env.js";

const facultyAuthRouter = Router();

facultyAuthRouter.post("/register", async (req, res) => {
  try {
    const { name, empId, password, isHOD } = req.body;

    const validFacDetails = facultyCreateDetails.parse({
      name,
      empId,
      password,
      isHOD,
    });

    const hashedPass = await bcrypt.hash(validFacDetails.password, 10);

    const faculty = await prisma.faculty.create({
      data: {
        empId: validFacDetails.empId,
        name: validFacDetails.name,
        password: hashedPass,
        isHOD: validFacDetails.isHOD,
      },
    });

    delete faculty.password;

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema: {
    "message": "Faculty created successfully",
    "faculty": {
        "id": 5,
        "empId": "12347",
        "name": "Faculty-5",
        "isHOD": false
    }
}
} */

    res.status(201).json({
      message: "Faculty created successfully",
      faculty,
    });

    console.log(e);
  } catch (e) {
    res.status(500).json({
      message: "Internal server error",
      error: e,
    });
  }
});

facultyAuthRouter.post("/login", async (req, res) => {
  const { empId, password } = req.body;

  try {
    const validFaculty = facultyLoginDetails.parse({
      empId,
      password,
    });

    const faculty = await prisma.faculty.findUnique({
      where: {
        empId: validFaculty.empId,
      },
    });

    if (!faculty) {
      return res.status(404).json({
        message:
          "Faculty not found, please register first or enter valid credentials",
        data: null,
      });
    }

    if (bcrypt.compareSync(validFaculty.password, faculty.password) === false) {
      return res.status(400).json({
        message: "Invalid password",
        data: null,
      });
    }

    const access_token = jwt.sign(
      {
        id: faculty.id,
        role: "faculty",
        empId: faculty.empId,
        name: faculty.name,
        isHOD: faculty.isHOD,
      },
      JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    delete faculty.password;

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema: {
    "message": "Logged in successfully",
    "data": {
        "id": 5,
        "empId": "12347",
        "name": "Faculty-5",
        "isHOD": false
    },
    "token": ""
}
} */

    return res.status(200).json({
      message: "Logged in successfully",
      data: faculty,
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

export default facultyAuthRouter;
