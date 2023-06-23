import { Router } from "express";
import prisma from "../../db.js";

const wardenInfoRouter = Router();

wardenInfoRouter.get("/", async (req, res) => {
  const { id } = req.user;

  try {
    if (!id) {
      return res.status(400).json({
        message: "Invalid token",
        data: null,
      });
    }

    const warden = await prisma.warden.findUnique({
      where: {
        id,
      },
      include: {
        complaint: true,
        leave: true,
      },
    });

    if (!warden) {
      return res.status(404).json({
        message: "Student not found",
        data: null,
      });
    }

    delete warden.password;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                      "id": 1,
                      "name": "Warden A",
                      "block": "A",
                      "complaint": [
                          {
                              "id": 1,
                              "complaintType": "Hostel",
                              "complaintDate": "20-06-2023",
                              "complaintDescription": "Tap Leak",
                              "complaintSeverity": "High",
                              "isResolved": true,
                              "studentId": 1,
                              "wardenId": 1
                          }
                      ],
                      "leave": [
                          {
                              "id": 1,
                              "leaveType": "Visit Temple",
                              "leaveDate": "21-06-2023",
                              "leaveTime": "12:00",
                              "LeaveDuration": "3d",
                              "isApproved": true,
                              "isRejected": false,
                              "studentId": 1,
                              "wardenId": 1
                          }
                      ]
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

export default wardenInfoRouter;
