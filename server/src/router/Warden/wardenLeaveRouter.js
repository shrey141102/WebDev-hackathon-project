import { Router } from "express";
import prisma from "../../db.js";

const wardenLeaveRouter = Router();

wardenLeaveRouter.get("/", async (req, res) => {
  const { block } = req.user;

  try {
    const warden = await prisma.warden.findUnique({
      where: {
        block,
      },
      include: {
        leave: {
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

    const { leave } = warden;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                    id: 1,
                    leaveType: "Visit Temple",
                    leaveDate: "21-06-2023",
                    leaveTime: "12:00",
                    LeaveDuration: "3d",
                    isApproved: true,
                    isRejected: false,
                    studentId: 1,
                    wardenId: 1,
                    Student: {
                        id: 1,
                        name: "John Doe",
                        regNo: "19BCE1000",
                        roomNo: "A-102"
                    }
                }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: leave,
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

wardenLeaveRouter.patch("/accept/:id", async (req, res) => {
  const { block } = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide leave id",
      data: null,
    });
  }

  try {
    const warden = await prisma.warden.findUnique({
      where: {
        block,
      },
      include: {
        leave: true,
      },
    });

    if (!warden) {
      return res.status(404).json({
        message: "Warden not found",
        data: null,
      });
    }

    const { leave } = warden;

    const leaveIndex = leave.findIndex((l) => l.id === Number(id));

    if (leaveIndex === -1) {
      return res.status(404).json({
        message: "Leave not found",
        data: null,
      });
    }

    // if leave has been reviewed already show error
    if (
      leave[leaveIndex].isApproved == true ||
      leave[leaveIndex].isRejected == true
    ) {
      return res.status(400).json({
        message: "Leave has already been reviewed",
        data: null,
      });
    }

    const leaveToAccept = leave[leaveIndex];

    const acceptedLeave = await prisma.leave.update({
      where: {
        id: leaveToAccept.id,
      },
      data: {
        ...leaveToAccept,
        isApproved: true,
        isRejected: false,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                    id: 1,
                    leaveType: "Visit Temple",
                    leaveDate: "21-06-2023",
                    leaveTime: "12:00",
                    LeaveDuration: "3d",
                    isApproved: false,
                    isRejected: false,
                    studentId: 1,
                    wardenId: 1
                }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: acceptedLeave,
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

wardenLeaveRouter.patch("/reject/:id", async (req, res) => {
  const { block } = req.user;

  const { id } = req.params;

  if (!id) {
    return res.status(400).json({
      message: "Please provide leave id",
      data: null,
    });
  }

  try {
    const warden = await prisma.warden.findUnique({
      where: {
        block,
      },
      include: {
        leave: true,
      },
    });

    if (!warden) {
      return res.status(404).json({
        message: "Warden not found",
        data: null,
      });
    }

    const { leave } = warden;

    const leaveIndex = leave.findIndex((l) => l.id === Number(id));

    if (leaveIndex === -1) {
      return res.status(404).json({
        message: "Leave not found",
        data: null,
      });
    }

    // if leave has been reviewed already show error
    if (
      leave[leaveIndex].isApproved == true ||
      leave[leaveIndex].isRejected == true
    ) {
      return res.status(400).json({
        message: "Leave has already been reviewed",
        data: null,
      });
    }

    const leaveToReject = leave[leaveIndex];

    const rejectedLeave = await prisma.leave.update({
      where: {
        id: leaveToReject.id,
      },
      data: {
        isApproved: false,
        isRejected: true,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                    id: 2,
                    leaveType: "Visit Temple",
                    leaveDate: "21-06-2023",
                    leaveTime: "12:00",
                    LeaveDuration: "3d",
                    isApproved: true,
                    isRejected: true,
                    studentId: 1,
                    wardenId: 1
                }
            }
    } */

    return res.status(200).json({
      message: "success",
      data: rejectedLeave,
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

export default wardenLeaveRouter;
