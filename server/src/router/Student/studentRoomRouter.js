import { Router } from "express";
import prisma from "../../db.js";

const studentRoomRouter = Router();

studentRoomRouter.get("/", async (req, res) => {
  try {
    const { id } = req.user;

    if (!id)
      return res.status(400).json({ error: "Student not found", data: null });

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        Room: true,
      },
    });

    if (!student)
      return res.status(400).json({ error: "Student not found", data: null });

    delete student.password;

    if (!student.Room) {
      return res
        .status(200)
        .json({ message: "Student not assigned a room", data: null });
    }

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                  id: 4,
                  roomNo: "A-105",
                  roomType: "AC",
                  roomCapacity: 2,
                  block: "A",
                  isFull: false
                }
                }
            }
    } */

    return res
      .status(200)
      .json({ message: "Student found", data: student.Room });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

export default studentRoomRouter;
