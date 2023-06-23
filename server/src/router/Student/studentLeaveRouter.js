import { Router } from "express";
import prisma from "../../db.js";
import { studentCreateLeaveSchema } from "../../schema/student_leave.js";

const studentLeaveRouter = Router();

// Path: /student/leave
// Params:
// Returns: Leave[]
// Error: {message: string, error: any}
studentLeaveRouter.get("/", async (req, res) => {
  const { id } = req.user;

  if (!id) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
      include: {
        leave: true,
      },
    });

    if (!student) {
      return res
        .status(400)
        .json({ message: "Invalid Token, User not found", data: null });
    }

    const { leave } = student;

    /* #swagger.responses[200] = {
          description: 'User successfully obtained.',
          schema: {
              message: 'Success',
              data: {
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
                    ]
                  }
                }
          }
  } */

    return res.status(200).json({ message: "Success", data: leave });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

// Path: /student/leave
// Params: leaveType, leaveDate, leaveTime, leaveDuration
// Returns: Leave
// Error: {message: string, error: any}
studentLeaveRouter.post("/", async (req, res) => {
  const { id } = req.user;
  const { leaveType, leaveDate, leaveTime, leaveDuration } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const validLeaveObj = studentCreateLeaveSchema.parse({
      leaveType,
      leaveDate,
      leaveTime,
      leaveDuration,
    });

    const { block } = req.user;

    if (!block) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    const warden = await prisma.warden.findUnique({
      where: {
        block: block,
      },
    });

    if (!warden) {
      return res.status(400).json({ message: "No Warden Found", data: null });
    }

    const leave = await prisma.leave.create({
      data: {
        leaveDate: validLeaveObj.leaveDate,
        LeaveDuration: validLeaveObj.leaveDuration,
        leaveTime: validLeaveObj.leaveTime,
        leaveType: validLeaveObj.leaveType,
        studentId: id,
        wardenId: warden.id,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data:  
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
                  }
            }
    } */

    return res.status(200).json({ message: "Success", data: leave });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

// Path: /student/leave
// Params: leaveId
// Returns: Leave updated
// Error: {message: string, error: any}
studentLeaveRouter.put("/", async (req, res) => {
  const { id } = req.user;
  const { leaveID, leaveType, leaveDate, leaveTime, leaveDuration } = req.body;

  if (!id || !leaveID) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const validLeaveObj = studentCreateLeaveSchema.parse({
      leaveType,
      leaveDate,
      leaveTime,
      leaveDuration,
    });

    const { block } = req.user;

    if (!block) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    const user = await prisma.student.findUnique({
      where: {
        id: id,
      },
      include: {
        leave: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    const { leave: leave_ } = user;

    const leaveIdx = leave_.findIndex((l) => l.id === leaveID);

    if (leaveIdx === -1) {
      return res
        .status(400)
        .json({ message: "Leave not found on the user", data: null });
    }

    if (leave_[leaveIdx].isApproved === true) {
      return res.status(400).json({
        message: "Leave already approved, Not allowed to change the Type Now!",
        data: null,
      });
    } else if (leave_[leaveIdx].isRejected === true) {
      return res.status(400).json({
        message: "Leave already rejected, Not allowed to change the Type Now!",
        data: null,
      });
    }

    const leave = await prisma.leave.update({
      where: {
        id: leaveID,
      },
      data: {
        leaveDate: validLeaveObj.leaveDate,
        LeaveDuration: validLeaveObj.leaveDuration,
        leaveTime: validLeaveObj.leaveTime,
        leaveType: validLeaveObj.leaveType,

        // not needed since these values are fixed
        // studentId: id,
        // wardenId: warden.id,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data:  
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
                  }
            }
    } */

    return res
      .status(200)
      .json({ message: "Updated successfully", data: leave });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

// Path: /student/leave
// Params: leaveId
// Returns: Leave deleted
// Error: {message: string, error: any}
studentLeaveRouter.delete("/", async (req, res) => {
  const { id } = req.user;
  const { leaveID } = req.body;

  if (!id || !leaveID) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const user = await prisma.student.findUnique({
      where: {
        id: id,
      },
      include: {
        leave: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    const { leave } = user;

    const leaveIdx = leave.findIndex((l) => l.id === leaveID);

    if (leaveIdx === -1) {
      return res
        .status(400)
        .json({ message: "Leave not found on the user", data: null });
    }

    if (leave[leaveIdx].isApproved === true) {
      return res.status(400).json({
        message: "Leave already approved, Not allowed to change the Type Now!",
        data: null,
      });
    } else if (leave[leaveIdx].isRejected === true) {
      return res.status(400).json({
        message: "Leave already rejected, Not allowed to change the Type Now!",
        data: null,
      });
    }

    const deleteLeave = await prisma.leave.delete({
      where: {
        id: leaveID,
      },
    });

    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
           schema: {
               message: 'Success',
               data:  
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
                 }
           }
   } */

    return res
      .status(200)
      .json({ message: "Deleted Successfully", data: deleteLeave });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

export default studentLeaveRouter;
