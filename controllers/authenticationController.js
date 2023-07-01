const jwt = require("jsonwebtoken");
const studentData = require("./../Models/StudentModels");
const speakerData = require("./../Models/speakerModels");


// to check username and password
exports.addLogin = (request, response, next) => {
  let token;
  // admin
  if (
    request.body.email == "mahmoud@gmail.com" &&
    request.body.password == 147
  ) {
    token = jwt.sign(
      { role: "adminstrator", email: "mahmoud@gmail.com" },
      process.env.SecretKey,
      {
        expiresIn: "1h",
      }
    );
    response.status(200).json({ message: "Login Successfully as adminstrator", token });
  } else {
    // check Speaker Email
    speakerData
      .findOne({ email: request.body.email })
      .then((data) => {
        if (data == null) {
          // check student Email
          studentData
            .findOne({ email: request.body.email })
            .then((data) => {
              if (data == null)
                throw new Error("your email or password is incorrect");

              token = jwt.sign(
                { role: "student", email: "mahmoud@gmail.com", id: data._id },
                process.env.SecretKey,
                {
                  expiresIn: "1h",
                }
              );
              response
                .status(200)
                .json({ message: "Login Successfully as student", token });
            })
            .catch((error) => next(error));
        } else {
          token = jwt.sign(
            { role: "speaker", email: "mahmoud@gmail.com", id: data._id },
            process.env.SecretKey,
            {
              expiresIn: "1h",
            }
          );
          response
            .status(200)
            .json({ message: "Login Successfully as speaker", token });
        }
      })
      .catch((error) => {
        next(error);
      });
  }
};
exports.registerStudent = (request, response, next) => {
  response.redirect(307, "/students");
};
exports.registerSpeaker = (request, response) => {
  response.redirect(307, "/speaker");
};
