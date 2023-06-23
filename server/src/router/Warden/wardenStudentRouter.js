import { Router } from "express";
import prisma from "../../db.js";

const wardenStudentRouter = Router();

wardenStudentRouter.get("/", async (req, res) => {
  const { block } = req.user;

  if (!block) {
    return res.json({
      data: null,
      message: "Invalid Token",
    });
  }

  try {
    const allStudents = await prisma.student.findMany({
      where: {
        block,
      },
    });

    allStudents.forEach((std) => {
      delete std.password;
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: "Success",
                data: {
                    id: 1,
                    name: "John Dow",
                    regNo: "21BCE1000",
                    block: "A",
                    roomNo: "A-102",
                    messType: "Special",
                    toBeChangedTo: "",
                    isForChange: false,
                    roomId: 3
                }
                }
            }
    } */

    return res.json({
      data: allStudents,
      message: "Success",
    });
  } catch (e) {
    console.log(e);

    return res.json({
      data: null,
      error: e,
      message: "Internal server error",
    });
  }
});

wardenStudentRouter.get("/:id", async (req, res) => {
  const { block } = req.user;
  const { id } = req.params;

  if (!block) {
    return res.json({
      data: null,
      message: "Invalid Token",
    });
  }

  if (!id) {
    return res.json({
      data: null,
      message: "Please send id",
    });
  }

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!student) {
      return res.json({
        data: null,
        message: "No student found",
      });
    }
    if (student.block !== block) {
      return res.json({
        data: null,
        message: "Student not in your block",
      });
    }

    delete student.password;

    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
           schema: {
               message: "Success",
               data: {
                   id: 2,
                   name: "John Wick",
                   regNo: "21BPS1388",
                   block: "A",
                   roomNo: "",
                   messType: "Veg",
                   toBeChangedTo: "",
                   isForChange: false,
                   roomId: null
               }
               }
           }
   } */

    return res.json({
      data: student,
      message: "Success",
    });
  } catch (e) {
    console.log(e);

    return res.json({
      data: null,
      error: e,
      message: "Internal server error",
    });
  }
});

export default wardenStudentRouter;
