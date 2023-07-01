const eventData = require("./../Models/eventModels");
const { validationResult } = require("express-validator");
const studentData = require("./../Models/StudentModels");
const res = require("express/lib/response");

function adminCheck(request) {
  if (request.role != "adminstrator") {
    throw new Error("Not Allowed");
  }
}
// Get Event Data
exports.getEvent = (request, response, next) => {
  eventData
    .find({})
    .populate(["speakersId", "studentsId"])
    .then((data) => {
      response.status(200).json({ message: "List of events", data });
    })
    .catch((error) => {
      next(error);
    });
};

// Get Event Data By Id
exports.getEventById = (request, response, next) => {
  let result = validationResult(request);
  if (!result.isEmpty()) {
    let message = result
      .array()
      .reduce((sum, error) => sum + error.msg + " ", "");
    let errorObject = new Error(message);
    errorObject.status = 422;
    throw errorObject;
  } // Validation

  eventData
    .find({ _id: request.params.id })
    .populate(["speakersId", "studentsId"])
    .then((data) => {
      response.status(200).json({ message: "List of event", data });
    })
    .catch((error) => {
      next(error);
    });
};

// Post Event Data
exports.postEvent = (request, response, next) => {
  adminCheck(request);
  let result = validationResult(request);
  if (!result.isEmpty()) {
    let message = result
      .array()
      .reduce((sum, error) => sum + error.msg + " ", "");
    let errorObject = new Error(message);
    errorObject.status = 422;
    throw errorObject;
  } // Validation

  studentData
    .findOne({ _id: request.body.studentsId })
    .then((data) => {
      if (data == null) throw new Error("The Student ID doesnot Exist");
    })
    .catch((error) => next(error));

  let eventObj = new eventData({
    //_id: request.body.id,
    title: request.body.title,
    eventDate: request.body.eventDate,
    mainSpeaker: request.body.mainSpeaker,
    speakersId: request.body.speakersId,
    studentsId: request.body.studentsId,
  });
  eventObj
    .save()
    .then(() => {
      response.status(201).json({ message: "add events" });
    })
    .catch((error) => next(error));
};

// Put Event Data
exports.putEvent = (request, response, next) => {
  adminCheck(request);

  eventData
    .findById(request.body.id)
    .then((data) => {
      if (data == null) throw new Error("The Event ID Doesn't Exist");
      (data.title = request.body.title),
        (data.eventDate = request.body.eventDate),
        (data.mainSpeaker = request.body.mainSpeaker),
        (data.speakersId = request.body.speakersId),
        (data.studentsId = request.body.studentsId);
      return data.save();
    })
    .then(() => {
      response.status(200).json({ message: "update events" });
    })
    .catch((error) => next(error));
};

// Delete Event
exports.deleteEvent = (request, response, next) => {
  adminCheck(request);
  eventData
    .deleteOne({ _id: request.body.id })
    .then(() => {
      response.status(200).json({ message: "delete events" });
    })
    .catch((error) => next(error));
};
