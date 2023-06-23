import { Router } from "express";
import prisma from "../../db.js";

const facultyCourseRouter = Router();

facultyCourseRouter.get("/get-all-courses", async (req, res) => {
  try {
    const { id } = req.user;
    const faculty = await prisma.faculty.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Course: true,
      },
    });

    if (!faculty) {
      return res.status(400).json({ message: "Include Token", data: null });
    }

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema: {
    "message": "Success",
    "data": [
        {
            "id": 1,
            "courseName": "Calculus",
            "courseCode": "BMAT101L",
            "courseType": "Theory",
            "courseCredits": 2,
            "courseTeacherId": 4
        },
        {
            "id": 2,
            "courseName": "DAA",
            "courseCode": "BCSE204L",
            "courseType": "Theory",
            "courseCredits": 4,
            "courseTeacherId": 4
        }
    ]
}
} */

    return res.status(200).json({ message: "Success", data: faculty.Course });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

facultyCourseRouter.get("/get-all-students-from-course", async (req, res) => {
  const { courseId } = req.body;
  const { id } = req.user;

  try {
    if (!courseId) {
      return res.status(400).json({ message: "Invalid Course Id", data: null });
    }

    const teacher = await prisma.faculty.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        Course: {
          include: {
            Student: true,
          },
        },
      },
    });

    if (!teacher) {
      return res.status(400).json({ message: "Invalid Course Id", data: null });
    }

    const courseIndex = teacher.Course.findIndex(
      (course) => course.id === Number(courseId)
    );

    if (courseIndex === -1) {
      return res.status(400).json({ message: "Invalid Course Id", data: null });
    }

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema: {
    "message": "Success",
    "data": [
        {
            "id": 1,
            "name": "John Wick",
            "regNo": "21BPS1390",
            "block": "A",
            "password": "$2b$10$hifMoCiUGNhY8Imz3chcIebaa5SuRBQPI/VgFOjYnBzy01ejwW4Hy",
            "roomNo": "A-102",
            "messType": "Special",
            "toBeChangedTo": "",
            "isForChange": false,
            "roomId": 3
        }
    ]
}
} */

    return res
      .status(200)
      .json({ message: "Success", data: teacher.Course[courseIndex].Student });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

export default facultyCourseRouter;
