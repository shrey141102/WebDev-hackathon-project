import { Router } from "express";
import prisma from "../../db.js";

const MAX_CREDS = 5;

const studentCourseRouter = Router();

studentCourseRouter.get("/get-all-registered", async (req, res) => {
  try {
    const { id } = req.user;
    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        course: true,
      },
    });

    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
           schema: {
    "message": "Success",
    "data": [
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


    return res.status(200).json({ message: "Success", data: student.course });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

studentCourseRouter.get("/get-all", async (req, res) => {
  try {
    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
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
    const courses = await prisma.course.findMany();
    return res.status(200).json({ message: "Success", data: courses });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

studentCourseRouter.post("/add-course", async (req, res) => {
  const { courseId } = req.body;

  try {
    if (!courseId) {
      return res.status(400).json({ message: "Invalid Course Id", data: null });
    }

    const course = await prisma.course.findUnique({
      where: {
        id: Number(courseId),
      },
    });

    if (!course) {
      return res.status(400).json({ message: "Invalid Course Id", data: null });
    }

    const { id } = req.user;

    const student = await prisma.student.findUnique({
      where: {
        id: Number(id),
      },
      include: {
        course: true,
      },
    });

    if (!student) {
      return res
        .status(400)
        .json({ message: "Invalid Student Id", data: null });
    }

    const isAlreadyEnrolled = student.course.find(
      (course) => course.id === Number(courseId)
    );

    if (isAlreadyEnrolled) {
      return res
        .status(400)
        .json({ message: "Student already enrolled in course", data: null });
    }

    let totalCreds = 0;

    student.course.forEach((course) => {
      totalCreds += course.courseCredits;
    });

    if (totalCreds + course.courseCredits > MAX_CREDS) {
      return res.status(400).json({
        message: "Student cannot enroll in more than 5 credits",
        data: null,
      });
    }

    const updatedStudent = await prisma.student.update({
      where: {
        id: Number(id),
      },
      data: {
        course: {
          connect: {
            id: Number(courseId),
          },
        },
      },
      include: {
        course: true,
      },
    });

    delete updatedStudent.password;

    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
           schema: {
    "message": "Success",
    "data": {
        "id": 2,
        "name": "John Wick",
        "regNo": "21BPS1388",
        "block": "A",
        "roomNo": "",
        "messType": "Veg",
        "toBeChangedTo": "",
        "isForChange": false,
        "roomId": null,
        "course": [
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
                "courseCredits": 1,
                "courseTeacherId": 4
            }
        ]
    }
}
   } */

    return res.status(200).json({ message: "Success", data: updatedStudent });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

export default studentCourseRouter;
