import { Router } from "express";
import prisma from "../../db.js";

const facultyEventRouter = Router();

facultyEventRouter.get("/get-all-unapproved", async (req, res) => {
  try {
    const { isHOD } = req.user;
    if (!isHOD) {
      return res.status(400).json({ message: "Not A HOD", data: null });
    }

    const events = await prisma.events.findMany({
      where: {
        isApproved: false,
        isRejected: false,
      },
    });

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema:{
    "message": "Success",
    "data": [
        {
            "id": 3,
            "eventName": "WebVerse2.0",
            "eventDescription": "fiuhgudasisnlgfdg",
            "eventPoster": "url://123/img.jpg",
            "eventDate": "10/10/2023",
            "eventTime": "10:00",
            "eventVenue": "MG Audi",
            "eventOrganiser": "Android Club",
            "participantCount": 12,
            "hostedBy": "Android Club",
            "isApproved": false,
            "isRejected": false
        }
    ]
}
} */

    return res.status(200).json({ message: "Success", data: events });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

facultyEventRouter.get("/get-all-approved", async (req, res) => {
  try {
    const { isHOD } = req.user;
    if (!isHOD) {
      return res.status(400).json({ message: "Not A HOD", data: null });
    }

    const events = await prisma.events.findMany({
      where: {
        isApproved: true,
      },
    });

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema: {
    "message": "Success",
    "data": [
        {
            "id": 1,
            "eventName": "WebVerse",
            "eventDescription": "fiuhguisnlgfdg",
            "eventPoster": "url://123/img.jpg",
            "eventDate": "10/10/2023",
            "eventTime": "10:00",
            "eventVenue": "MG Audi",
            "eventOrganiser": "Android Club",
            "participantCount": 12,
            "hostedBy": "Android Club",
            "isApproved": true,
            "isRejected": false
        }
    ]
}
} */


    return res.status(200).json({ message: "Success", data: events });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

facultyEventRouter.post("/approve-event", async (req, res) => {
  try {
    const { eventId } = req.body;
    const { isHOD } = req.user;
    if (!isHOD) {
      return res.status(400).json({ message: "Not A HOD", data: null });
    }

    if (!eventId) {
      return res.status(400).json({ message: "Invalid Event Id", data: null });
    }

    const event = await prisma.events.findUnique({
      where: {
        id: Number(eventId),
      },
    });

    if (!event) {
      return res.status(400).json({ message: "Invalid Event Id", data: null });
    }

    if (event.isApproved) {
      return res
        .status(400)
        .json({ message: "Event already approved", data: null });
    }

    if (event.isRejected) {
      return res
        .status(400)
        .json({ message: "Event already rejected", data: null });
    }

    const updatedEvent = await prisma.events.update({
      where: {
        id: Number(eventId),
      },
      data: {
        isApproved: true,
        isRejected: false,
      },
    });

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema: {
    "message": "Success",
    "data": {
        "id": 4,
        "eventName": "WebVerse3.0",
        "eventDescription": "fiuhgudasisnlgfdg",
        "eventPoster": "url://123/img.jpg",
        "eventDate": "10/10/2023",
        "eventTime": "10:00",
        "eventVenue": "MG Audi",
        "eventOrganiser": "Android Club",
        "participantCount": 12,
        "hostedBy": "Android Club",
        "isApproved": true,
        "isRejected": false
    }
}
} */

    return res.status(200).json({ message: "Success", data: updatedEvent });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

facultyEventRouter.post("/reject-event", async (req, res) => {
  try {
    const { isHOD } = req.user;
    if (!isHOD) {
      return res.status(400).json({ message: "Not A HOD", data: null });
    }
    const { eventId } = req.body;
    if (!eventId) {
      return res.status(400).json({ message: "Invalid Event Id", data: null });
    }

    const event = await prisma.events.findUnique({
      where: {
        id: Number(eventId),
      },
    });

    if (!event) {
      return res.status(400).json({ message: "Invalid Event Id", data: null });
    }

    if (event.isApproved) {
      return res
        .status(400)
        .json({ message: "Event already approved", data: null });
    }

    if (event.isRejected) {
      return res
        .status(400)
        .json({ message: "Event already rejected", data: null });
    }

    const updatedEvent = await prisma.events.update({
      where: {
        id: Number(eventId),
      },
      data: {
        isApproved: false,
        isRejected: true,
      },
    });

    /* #swagger.responses[200] = {
        description: 'Faculty successfully registered.',
        schema: {
    "message": "Success",
    "data": {
        "id": 4,
        "eventName": "WebVerse3.0",
        "eventDescription": "fiuhgudasisnlgfdg",
        "eventPoster": "url://123/img.jpg",
        "eventDate": "10/10/2023",
        "eventTime": "10:00",
        "eventVenue": "MG Audi",
        "eventOrganiser": "Android Club",
        "participantCount": 12,
        "hostedBy": "Android Club",
        "isApproved": false,
        "isRejected": true
    }
}
} */

    return res.status(200).json({ message: "Success", data: updatedEvent });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

export default facultyEventRouter;
