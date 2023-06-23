import { Router } from "express";
import prisma from "../../db.js";
import { facultyEventSchema } from "../../schema/faculty_event.js";

const studentEventRouter = Router();

studentEventRouter.post("/", async (req, res) => {
  const { id } = req.user;
  const {
    eventName,
    eventDescription,
    eventDate,
    eventTime,
    eventVenue,
    eventOrganiser,
    participantCount,
    hostedBy,
    eventPoster,
  } = req.body;

  if (!id) {
    return res.status(400).json({ message: "Invalid Token", data: null });
  }

  try {
    const validEventObj = facultyEventSchema.parse({
      eventName,
      eventDescription,
      eventDate,
      eventTime,
      eventVenue,
      eventOrganiser,
      participantCount,
      hostedBy,
      eventPoster,
    });

    const event = await prisma.events.create({
      data: {
        eventName: validEventObj.eventName,
        eventDescription: validEventObj.eventDescription,
        eventDate: validEventObj.eventDate,
        eventTime: validEventObj.eventTime,
        eventVenue: validEventObj.eventVenue,
        eventOrganiser: validEventObj.eventOrganiser,
        participantCount: validEventObj.participantCount,
        hostedBy: validEventObj.hostedBy,
        eventPoster: validEventObj.eventPoster,
      },
    });

    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
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
        "isRejected": false
    }
}
   } */

    return res.status(200).json({ message: "Success", data: event });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

studentEventRouter.get("/", async (req, res) => {
  try {
    const events = await prisma.events.findMany({
      where: {
        isApproved: true,
      },
    });

    /* #swagger.responses[200] = {
           description: 'User successfully obtained.',
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
        },
        {
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
    ]
}
   } */

    return res.status(200).json({ message: "Success", data: events });
  } catch (e) {
    console.log(e);
    return res.status(500).json({ message: "Internal Server Error", error: e });
  }
});

export default studentEventRouter;
