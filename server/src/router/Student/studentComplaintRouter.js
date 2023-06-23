import { Router } from "express";
import prisma from "../../db.js";
import { studentCreateComplaintSchema } from "../../schema/student_complaint.js";

const studentComplaintRouter = Router();

// Path: /student/complaint
// Params:
// Returns: Complaint[]
// Error: {message: string, error: any}
studentComplaintRouter.get("/", async (req, res) => {
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
        complaint: true,
      },
    });

    if (!student) {
      return res
        .status(400)
        .json({ message: "Invalid Token, User not found", data: null });
    }

    const { complaint } = student;

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
                           wardenId: 1
                       },
                     ]
                 }
           }
   } */

    return res.status(200).json({ message: "Success", data: complaint });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

// Path: /student/complaint
// Params: complaintType, complaintDate, complaintDescription, complaintSeverity
// Returns: Complaint
// Error: {message: string, error: any}
studentComplaintRouter.post("/", async (req, res) => {
  const { id } = req.user;
  const {
    complaintType,
    complaintDate,
    complaintDescription,
    complaintSeverity,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const validComplaintObj = studentCreateComplaintSchema.parse({
      complaintType,
      complaintDate,
      complaintDescription,
      complaintSeverity,
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

    const complaint = await prisma.complaint.create({
      data: {
        complaintType: validComplaintObj.complaintType,
        complaintDate: validComplaintObj.complaintDate,
        complaintDescription: validComplaintObj.complaintDescription,
        complaintSeverity: validComplaintObj.complaintSeverity,
        studentId: id,
        wardenId: warden.id,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                        id: 1,
                        complaintType: "Electrical",
                        complaintDate: "2021-05-05",
                        complaintDescription: "Lights not working",
                        complaintSeverity: "High",
                        isResolved: false,
                        studentId: 1,
                        wardenId: 1
                  }
            }
    } */

    return res.status(200).json({ message: "Success", data: complaint });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

// Path: /student/complaint
// Params: complaintId
// Returns: Complaint updated
// Error: {message: string, error: any}
studentComplaintRouter.put("/", async (req, res) => {
  const { id } = req.user;
  const {
    complaintId,
    complaintType,
    complaintDate,
    complaintDescription,
    complaintSeverity,
  } = req.body;

  if (!id || !complaintId) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const validComplaintObj = studentCreateComplaintSchema.parse({
      complaintType,
      complaintDate,
      complaintDescription,
      complaintSeverity,
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
        complaint: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    const { complaint: complaint_ } = user;

    const complaintIdx = complaint_.findIndex((l) => l.id === complaintId);

    if (complaintIdx === -1) {
      return res
        .status(400)
        .json({ message: "Complaint not found on the user", data: null });
    }

    if (complaint_[complaintIdx].isResolved === true) {
      return res.status(400).json({
        message:
          "Complaint already approved, Not allowed to change the Type Now!",
        data: null,
      });
    } else if (complaint_[complaintIdx].isRejected === true) {
      return res.status(400).json({
        message:
          "Complaint already rejected, Not allowed to change the Type Now!",
        data: null,
      });
    }

    const complaint = await prisma.complaint.update({
      where: {
        id: complaintId,
      },
      data: {
        complaintType: validComplaintObj.complaintType,
        complaintDate: validComplaintObj.complaintDate,
        complaintDescription: validComplaintObj.complaintDescription,
        complaintSeverity: validComplaintObj.complaintSeverity,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                        id: 1,
                        complaintType: "Electrical",
                        complaintDate: "2021-05-05",
                        complaintDescription: "Lights not working",
                        complaintSeverity: "High",
                        isResolved: false,
                        studentId: 1,
                        wardenId: 1
                  }
            }
    } */

    return res
      .status(200)
      .json({ message: "Updated successfully", data: complaint });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

// Path: /student/complaint
// Params: complaintId
// Returns: complaint deleted
// Error: {message: string, error: any}
studentComplaintRouter.delete("/", async (req, res) => {
  const { id } = req.user;
  const { complaintId } = req.body;

  if (!id || !complaintId) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const user = await prisma.student.findUnique({
      where: {
        id: id,
      },
      include: {
        complaint: true,
      },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid Token", data: null });
    }

    const { complaint } = user;

    const complaintIdx = complaint.findIndex((l) => l.id === complaintId);

    if (complaintIdx === -1) {
      return res
        .status(400)
        .json({ message: "Complaint not found on the user", data: null });
    }

    if (complaint[complaintIdx].isResolved === true) {
      return res.status(400).json({
        message:
          "Complaint already approved, Not allowed to change the Type Now!",
        data: null,
      });
    } else if (complaint_[complaintIdx].isRejected === true) {
      return res.status(400).json({
        message:
          "Complaint already rejected, Not allowed to change the Type Now!",
        data: null,
      });
    }

    const deleteComplaint = await prisma.complaint.delete({
      where: {
        id: complaintId,
      },
    });

    /* #swagger.responses[200] = {
        description: 'User successfully obtained.',
        schema: {
            message: 'Deleted successfully',
            data: {
                    id: 1,
                    complaintType: "Electrical",
                    complaintDate: "2021-05-05",
                    complaintDescription: "Lights not working",
                    complaintSeverity: "High",
                    isResolved: false,
                    studentId: 1,
                    wardenId: 1
              }
        }
} */

    return res
      .status(200)
      .json({ message: "Deleted Successfully", data: deleteComplaint });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

export default studentComplaintRouter;
