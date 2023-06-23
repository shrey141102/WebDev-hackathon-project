import { Router } from "express";
import { wardenCreateRoomSchema } from "../../schema/warden_room.js";
import prisma from "../../db.js";

const wardenRoomRouter = Router();

wardenRoomRouter.get("/", async (req, res) => {
  try {
    const { block } = req.user;

    if (!block)
      return res.status(400).json({ error: "Block not found", data: null });

    const rooms = await prisma.room.findMany({
      where: {
        block: block,
      },
      include: {
        students: {
          select: {
            name: true,
            regNo: true,
            block: true,
          },
        },
      },
    });

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

    return res.json({ message: "Rooms fetched successfully", data: rooms });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

wardenRoomRouter.post("/create", async (req, res) => {
  const { block } = req.user;
  try {
    const {roomNo, roomCapacity, roomType} = req.body;
    const input = wardenCreateRoomSchema.parse(req.body);

    const existingRoom = await prisma.room.findUnique({
      where: {
        roomNo: input.roomNo,
      },
    });

    // if there is an existing room with same number in same block throw error
    if (existingRoom && existingRoom.block === block) {
      return res
        .status(400)
        .json({ error: "Room already exists in given block", data: null });
    }

    const room = await prisma.room.create({
      data: {
        block: block,
        roomNo: input.roomNo,
        roomCapacity: Number(input.roomCapacity),
        roomType: input.roomType,
      },
    });

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
      .json({ message: "Room created successfully", data: room });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

wardenRoomRouter.get("/getAllNotAssignedStudents", async (req, res) => {
  try {
    const { block } = req.user;
    if (!block)
      return res.status(400).json({ error: "Block not found", data: null });
    

    const students = await prisma.student.findMany({
      where: {
        block: block,
        roomId: null,
      },
      select: {
        id: true,
        name: true,
        regNo: true,
        block: true,
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                        id: 2,
                        name: "John Doe",
                        regNo: "21BCE1000",
                        block: "A"
                      }
                }
            }
    } */

    return res.json({
      message: "Students fetched successfully",
      data: students,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
});

wardenRoomRouter.get("/getAllNotAssignedRooms", async (req, res) => {
  try {
    const { block } = req.user;
    if (!block)
      return res.status(400).json({ error: "Block not found", data: null });

    const rooms = await prisma.room.findMany({
      where: {
        isFull: false,
        block: block,
      },
      include: {
        students: {
          select: {
            id: true,
            name: true,
            regNo: true,
            block: true,
          },
        },
      },
    });

    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
           schema: {
               message: 'Success',
               data: [
                   {
                     id: 3,
                     roomNo: "A-102",
                     roomType: "AC",
                     roomCapacity: 2,
                     block: "A",
                     isFull: false,
                     students: [
                         {
                             id: 1,
                             name: "John Doe",
                             regNo: "21BCE1000",
                             block: "A"
                         }
                       ]
                   }
               ]
               }
           }
   } */


    return res.json({
      message: "Rooms fetched successfully",
      data: rooms,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

wardenRoomRouter.post("/assignRoom", async (req, res) => {
  try {
    const { studentId, roomId } = req.body;
    const { block } = req.user;

    if (!studentId || !roomId)
      return res
        .status(400)
        .json({ error: "StudentId or roomId not found", data: null });

    if (!block)
      return res.status(400).json({ error: "Block not found", data: null });

    const student = await prisma.student.findUnique({
      where: {
        id: Number(studentId),
      },
    });

    if (!student)
      return res.status(400).json({ error: "Student not found", data: null });

    if (student.roomId !== null) {
      return res
        .status(400)
        .json({ error: "Student Already in a room", data: null });
    }

    if (student.block !== block) {
      return res.json({
        message: "Only wardens from respective blocks can add theirs students!",
        data: null,
      });
    }

    const room = await prisma.room.findUnique({
      where: {
        id: Number(roomId),
      },
      include: {
        students: true,
      },
    });

    if (!room)
      return res.status(400).json({ error: "Room not found", data: null });

    if (room.isFull)
      return res.status(400).json({ error: "Room is full", data: null });

    const updatedStudent = await prisma.student.update({
      where: {
        id: Number(studentId),
      },
      data: {
        roomNo: room.roomNo,
        Room: {
          connect: {
            roomNo: room.roomNo,
          },
        },
      },
    });

    await prisma.room.update({
      where: {
        id: Number(roomId),
      },
      data: {
        isFull: room.students.length + 1 === room.roomCapacity,
      },
    });

    delete updatedStudent.password;

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                message: 'Success',
                data: {
                      id: 4,
                      name: "John Wick",
                      regNo: "21BPS1769",
                      block: "A",
                      roomNo: "A-105",
                      messType: "Veg",
                      toBeChangedTo: "Non Veg",
                      isForChange: true,
                      roomId: 4
                    }
                }
            }
    } */

    return res.json({
      message: "Student assigned successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
});

wardenRoomRouter.post("/removeStudent", async (req, res) => {
  try {
    const { studentId, roomId } = req.body;
    const { block } = req.user;

    if (!studentId || !roomId)
      return res.json({ error: "StudentId or RoomId not found", data: null });

    if (!block) return res.json({ error: "Block not found", data: null });

    const student = await prisma.student.findFirst({
      where: {
        id: Number(studentId),
      },
    });

    if (!student) {
      return res.json({
        message: "No student found",
        data: null,
      });
    }

    if (student.block !== block) {
      return res.json({
        message:
          "Only wardens from respective blocks can remove theirs students!",
        data: null,
      });
    }

    const room = await prisma.room.update({
      data: {
        students: {
          disconnect: {
            id: Number(studentId),
          },
        },
        isFull: false,
      },
      where: {
        id: Number(roomId),
      },
    });

    /* #swagger.responses[200] = {
            description: 'User successfully obtained.',
            schema: {
                data: {
                    id: 4,
                    roomNo: "A-105",
                    roomType: "AC",
                    roomCapacity: 2,
                    block: "A",
                    isFull: false
                },
                message: "Removed from room successfully"
                }
            }
    } */

    return res.json({
      data: room,
      message: "Removed from room successfully",
    });
  } catch (e) {
    console.log(e);
    return res.json({
      error: e,
      data: null,
    });
  }
});
export default wardenRoomRouter;
