const speakerData = require("./../Models/speakerModels");
const { validationResult } = require("express-validator");
const { default: mongoose } = require("mongoose");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (request, file, cb) {
    cb(null, path.resolve(__dirname, "/../images"));
  },
  filename: function (request, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
var upload = multer({ storage: storage });

// check admin email
function adminCheck(request) {
  if (request.role != "adminstrator") {
    throw new Error("Not Allowed");
  }
}
// check student email
function userCheck(request) {
  if (request.role != "speaker" && request.role != "adminstrator") {
    throw new Error("Not Allowed");
  }
}
// Get Speaker Data
exports.getSpeaker = (request, response, next) => {
  adminCheck(request);
  speakerData
    .find({})
    .then((data) => {
      response.status(200).json({ message: "List of speakers", data });
    })
    .catch((error) => {
      next(error);
    });
};
// Get Speaker Data By Id
exports.getSpeakerById = (request, response, next) => {
  userCheck(request);
  if (request.id == request.params.id || request.role == "adminstrator") {
    let result = validationResult(request);
    if (!result.isEmpty()) {
      let message = result
        .array()
        .reduce((sum, error) => sum + error.msg + " ", "");
      let errorObject = new Error(message);
      errorObject.status = 422;
      throw errorObject;
    } // Validation
    speakerData
      .find({ _id: request.params.id })
      .then((data) => {
        response.status(200).json({ message: "List of speaker", data });
      })
      .catch((error) => {
        next(error);
      });
  } else {
    throw new Error("Not Allowed");
  }
};

// Post Speaker Data
exports.postSpeaker = (request, response, next) => {
  //adminCheck(request);
  let result = validationResult(request);
  if (!result.isEmpty()) {
    let message = result
      .array()
      .reduce((sum, error) => sum + error.msg + " , ", "");
    let errorObject = new Error(message);
    errorObject.status = 422;
    throw errorObject;
  } // Validation

  upload.single("imageForm");

  let speakerObj = new speakerData({
    _id: new mongoose.Types.ObjectId(),
    email: request.body.email,
    password: request.body.password,
    fullName: request.body.fullName,
    image: request.file.originalname,
  });
  speakerObj
    .save()
    .then(() => {
      response.status(201).json({ message: "add speaker" });
    })
    .catch((error) => next(error));
};

// Put Speaker Data
exports.putSpeaker = (request, response, next) => {
  userCheck(request);
  if (request.id == request.body.id || request.role == "adminstrator") {
    speakerData
      .findById(request.body.id)
      .then((data) => {
        if (data == null) throw new Error("The speaker ID Doesn't Exist");
        (data.email = request.body.email),
          (data.password = request.body.password),
          (data.fullName = request.body.fullName),
          (data.image = request.body.image);
        return data.save();
      })
      .then((data) => {
        response.status(200).json({ message: "update speaker" });
      })
      .catch((error) => next(error));
  } else {
    throw new Error("Not Allowed");
  }
};

// Delete Speaker
exports.deleteSpeaker = (request, response, next) => {
  adminCheck(request);

  speakerData
    .deleteOne({ _id: request.body.id })
    .then(() => {
      response.status(200).json({ message: "delete speakers" });
    })
    .catch((error) => next(error));
};
