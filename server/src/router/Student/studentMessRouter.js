import { Router } from "express";
import prisma from "../../db.js";
import { studentChangeMessSchema } from "../../schema/student_mess.js";

const studentMessRouter = Router();

// Path: /student/complaint
// Params:
// Returns: Complaint[]
// Error: {message: string, error: any}
studentMessRouter.get("/", async (req, res) => {
  const { id } = req.user;

  if (!id) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
      select: {
        messType: true,
      },
    });

    if (!student) {
      return res
        .status(400)
        .json({ message: "Invalid Token, User not found", data: null });
    }

    const { messType } = student;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: "Veg"
                }
            }
    } */

    return res.status(200).json({ message: "Success", data: messType });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

studentMessRouter.put("/", async (req, res) => {
  const { id } = req.user;
  const { messType } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const validMessObj = studentChangeMessSchema.parse({
      messType: messType,
    });

    const { block } = req.user;

    if (!block) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    const user = await prisma.student.findUnique({
      where: {
        id: id,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    if (user.isForChange) {
      return res
        .status(400)
        .json({ message: "You already have a pending request", data: null });
    }

    const mess = await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        toBeChangedTo: validMessObj.messType,
        isForChange: true,
      },
    });

    delete mess.password;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                    id: 4,
                    name: "John Dow",
                    regNo: "19BCE1000",
                    block: "A",
                    roomNo: "",
                    messType: "Veg",
                    toBeChangedTo: "Non Veg",
                    isForChange: true,
                    roomId: null
                }
                }
            }
    } */


    return res
      .status(200)
      .json({ message: "Request raised successfully", data: mess });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

export default studentMessRouter;
