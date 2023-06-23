import { Router } from "express";
import prisma from "../../db.js";

const studentInfoRouter = Router();

studentInfoRouter.get("/", async (req, res) => {
  const { id } = req.user;

  try {
    if (!id) {
      return res.status(400).json({
        message: "Invalid token",
        data: null,
      });
    }

    const student = await prisma.student.findUnique({
      where: {
        id,
      },
      include: {
        complaint: true,
        leave: true,
        Room: true,
      },
    });

    if (!student) {
      return res.status(404).json({
        message: "Student not found",
        data: null,
      });
    }

    delete student.password;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                    id: 1,
                    name: "John Doe",
                    email: "john@doe.com",
                    phone_number: "+639784561234",
                    block: "A",
                    regNo: "19BCE0000",
                    Room: {
                        id: 1,
                        roomNo: "101",
                        block: "A",
                        studentId: 1
                    },
                    complaint: [
                        {
                            id: 1,
                            complaintType: "Electrical",
                            complaintDate: "2021-05-05",
                            complaintDescription: "Lights not working",
                            complaintSeverity: "High",
                            isResolved: false,
                            studentId: 1,
                            wardenId: 1
                            }
                          ],
                    leave: [
                        {
                            id: 1,
                            leaveType: "Casual",
                            leaveDate: "2021-05-05",
                            leaveTime: "10:00:00",
                            LeaveDuration: "1",
                            isApproved: false,
                            isRejected: false,
                            studentId: 1,
                            wardenId: 1
                        }
                      ],
                  }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: student,
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

studentInfoRouter.get("/my-warden", async (req, res) => {
  const { block } = req.user;

  try {
    const warden = await prisma.warden.findUnique({
      where: {
        block,
      },
    });

    if (!warden) {
      return res.status(404).json({
        message: "Warden not found",
        data: null,
      });
    }

    delete warden.password;

     /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'success',
                data: {
                    id: 1,
                    name: "John Doe",
                    block: "A"
                  }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: warden,
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

export default studentInfoRouter;
