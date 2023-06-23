import { Router } from "express";
import prisma from "../../db.js";

const wardenComplaintRouter = Router();

wardenComplaintRouter.get("/", async (req, res) => {
  const { block } = req.user;

  try {
    const warden = await prisma.warden.findUnique({
      where: {
        block,
      },
      include: {
        complaint: {
          include: {
            Student: {
              select: {
                id: true,
                name: true,
                regNo: true,
                roomNo: true,
              },
            },
          },
        },
      },
    });

    if (!warden) {
      return res.status(404).json({
        message: "Warden not found",
        data: null,
      });
    }

    const { complaint } = warden;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                    complaint: [
                        {
                            id: 1,
                            complaintType: "Electrical",
                            complaintDate: "2021-05-05",
                            complaintDescription: "Lights not working",
                            complaintSeverity: "High",
                            isResolved: false,
                            studentId: 1,
                            wardenId: 1,
                            Student: {
                                id: 1,
                                name: "John Wick",
                                regNo: "21BPS1390",
                                roomNo: "A-102"
                            }
                        },
                      ]
                  }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: complaint,
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

wardenComplaintRouter.patch("/accept/:id", async (req, res) => {
  const { block } = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide complaint id",
      data: null,
    });
  }

  try {
    const warden = await prisma.warden.findUnique({
      where: {
        block,
      },
      include: {
        complaint: true,
      },
    });

    if (!warden) {
      return res.status(404).json({
        message: "Warden not found",
        data: null,
      });
    }

    const { complaint } = warden;

    const complaintIndex = complaint.findIndex((c) => c.id === Number(id));

    if (complaintIndex === -1) {
      return res.status(404).json({
        message: "Complaint not found",
        data: null,
      });
    }

    const complaintToAccept = complaint[complaintIndex];

    if (complaintToAccept.isRejected === true) {
      return res.status(400).json({
        message:
          "Complaint already rejected, Not allowed to change the Type Now!",
        data: null,
      });
    } else if (complaintToAccept.isResolved === true) {
      return res.status(400).json({
        message:
          "Complaint already resolved, Not allowed to change the Type Now!",
        data: null,
      });
    }

    const acceptedComplaint = await prisma.complaint.update({
      where: {
        id: complaintToAccept.id,
      },
      data: {
        ...complaintToAccept,
        isResolved: true,
        isRejected: false,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                      id: 1,
                      complaintType: "Hostel",
                      complaintDate: "20-06-2023",
                      complaintDescription: "Tap Leak",
                      complaintSeverity: "High",
                      isResolved: true,
                      isRejected: false
                      studentId: 1,
                      wardenId: 1
                  }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: acceptedComplaint,
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

wardenComplaintRouter.patch("/reject/:id", async (req, res) => {
  const { block } = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide complaint id",
      data: null,
    });
  }

  try {
    const warden = await prisma.warden.findUnique({
      where: {
        block,
      },
      include: {
        complaint: true,
      },
    });

    if (!warden) {
      return res.status(404).json({
        message: "Warden not found",
        data: null,
      });
    }

    const { complaint } = warden;

    const complaintIndex = complaint.findIndex((c) => c.id === Number(id));

    if (complaintIndex === -1) {
      return res.status(404).json({
        message: "Complaint not found",
        data: null,
      });
    }

    const complaintToReject = complaint[complaintIndex];

    if (complaintToReject.isRejected === true) {
      return res.status(400).json({
        message:
          "Complaint already rejected, Not allowed to change the Type Now!",
        data: null,
      });
    } else if (complaintToReject.isResolved === true) {
      return res.status(400).json({
        message:
          "Complaint already resolved, Not allowed to change the Type Now!",
        data: null,
      });
    }

    const rejectedComplaint = await prisma.complaint.update({
      where: {
        id: complaintToReject.id,
      },
      data: {
        isResolved: false,
        isRejected: true,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                      id: 1,
                      complaintType: "Hostel",
                      complaintDate: "20-06-2023",
                      complaintDescription: "Tap Leak",
                      complaintSeverity: "High",
                      isResolved: false,
                      isRejected: true,
                      studentId: 1,
                      wardenId: 1
                  }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: rejectedComplaint,
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

export default wardenComplaintRouter;
