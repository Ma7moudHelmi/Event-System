const studentData = require("./../Models/StudentModels");
const { validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
// check admin email
function adminCheck(request) {
  if (request.role != "adminstrator") {
    throw new Error("Not Allowed");
  }
}
// check student email
function userCheck(request) {
  if (request.role != "student" && request.role != "adminstrator") {
    throw new Error("Not Allowed");
  }
}
// Get Student Data
exports.getStudent = (request, response, next) => {
  adminCheck(request);
  studentData
    .find({})
    .then((data) => {
      response.status(200).json({ message: "List of students", data });
    })
    .catch((error) => {
      next(error);
    });
};

// Get Student Data By Id
exports.getStudentById = (request, response, next) => {
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
  studentData
    .find({ _id: request.params.id })
    .then((data) => {
      response.status(200).json({ message: "List of student", data });
    })
    .catch((error) => {
      next(error);
    });
  }else{
    throw new Error("Not Allowed");
  }
};

// Post Student Data
exports.postStudent = (request, response, next) => {
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
  const hash = bcrypt.hashSync(request.body.password, 10);
  let studentObj = new studentData({
    //_id: request.body.id,
    email: request.body.email,
    password: hash,
    fullName: request.body.fullName,
  });
  studentObj
    .save()
    .then(() => {
      response.status(201).json({ message: "add students" });
    })
    .catch((error) => next(error));
};

// Put Student Data
exports.putStudent = (request, response, next) => {
  userCheck(request);
  if (request.id == request.body.id || request.role == "adminstrator") {
  studentData
    .findById(request.body.id)
    .then((data) => {
      if (data == null) throw new Error("The Student ID Doesn't Exist");
      (data.email = request.body.email),
        (data.password = request.body.password),
        (data.fullName = request.body.fullName);
      return data.save();
    })
    .then((data) => {
      response.status(200).json({ message: "update students" });
    })
    .catch((error) => next(error));
  }else{
    throw new Error("Not Allowed");
  }
};

// Delete Student
exports.deleteStudent = (request, response, next) => {
  adminCheck(request);
  studentData
    .deleteOne({ _id: request.body.id })
    .then(() => {
      response.status(200).json({ message: "delete students" });
    })
    .catch((error) => next(error));
};
