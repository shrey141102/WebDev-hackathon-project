import { Router } from "express";
import prisma from "../../db.js";

const wardenMessRouter = Router();

wardenMessRouter.get("/", async (req, res) => {
  const { block } = req.user;

  try {
    const students = await prisma.student.findMany({
      where: {
        block,
      },
      select: {
        id: true,
        name: true,
        regNo: true,
        block: true,
        messType: true,
        isForChange: true,
        toBeChangedTo: true,
        Room: {
          select: {
            roomNo: true,
          },
        },
      },
    });

    if (!students) {
      return res.status(404).json({
        message: "Students not found",
        data: null,
      });
    }

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
    "message": "success",
    "data": [
        {
            "id": 1,
            "name": "John Wick",
            "regNo": "21BPS1390",
            "block": "A",
            "messType": "Special",
            "isForChange": false,
            "toBeChangedTo": "",
            "Room": {
                "roomNo": "A-102"
            }
        },
        {
            "id": 2,
            "name": "John Wick",
            "regNo": "21BPS1388",
            "block": "A",
            "messType": "Veg",
            "isForChange": false,
            "toBeChangedTo": "",
            "Room": null
        }
    ]
}
    } */

    return res.status(200).json({
      message: "success",
      data: students,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
      error: e,
    });
  }
});

wardenMessRouter.patch("/accept/:id", async (req, res) => {
  const { block } = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide student id",
      data: null,
    });
  }

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        id: true,
        messType: true,
        toBeChangedTo: true,
        isForChange: true,
        name: true,
        regNo: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        data: null,
      });
    }

    if (!student.isForChange) {
      return res.status(400).json({
        message: "Student is not for mess change",
        data: null,
      });
    }

    const { toBeChangedTo } = student;

    if (!toBeChangedTo) {
      return res.status(400).json({
        message: "Please provide mess type to be changed to",
        data: null,
      });
    }

    const acceptedMess = await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: {
        messType: toBeChangedTo,
        toBeChangedTo: "",
        isForChange: false,
      },
    });

    delete acceptedMess.password;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                        id: 4,
                        name: "John Dow",
                        regNo: "21BCE1000",
                        block: "A",
                        roomNo: "A-105",
                        messType: "Non Veg",
                        toBeChangedTo: "",
                        isForChange: false,
                        roomId: 4
                      }
                }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: acceptedMess,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
      error: e,
    });
  }
});

wardenMessRouter.patch("/reject/:id", async (req, res) => {
  const { block } = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide student id",
      data: null,
    });
  }

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
      select: {
        messType: true,
        toBeChangedTo: true,
        isForChange: true,
        name: true,
        regNo: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        data: null,
      });
    }

    if (!student.isForChange) {
      return res.status(400).json({
        message: "Student is not for mess change",
        data: null,
      });
    }

    const rejectMess = await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: {
        toBeChangedTo: "",
        isForChange: false,
      },
    });

    delete rejectMess.password;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                        id: 4,
                        name: "John Dow",
                        regNo: "21BCE1000",
                        block: "A",
                        roomNo: "A-105",
                        messType: "Veg",
                        toBeChangedTo: "",
                        isForChange: false,
                        roomId: 4
                      }
                }
            }
    } */

    return res.status(200).json({
      message: "Mess Request Rejected",
      data: rejectMess,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Internal Server Error",
      data: null,
      error: e,
    });
  }
});

export default wardenMessRouter;
