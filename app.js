const express = require("express");
const morgan = require("morgan");
const body_parser = require("body-parser");
const mongoose = require("mongoose");

/* Local File Variable */
const authRouter = require("./Routers/authenticationRouter");
const speakerRouter = require("./Routers/SpeakerRouter");
require("dotenv").config();
const eventRouter = require("./Routers/eventRouter");
const studentRouter = require("./Routers/StudentRouter");
const path = require("path");
const multer = require("multer");
// const upload = multer({ dest: 'images' })

const app = express();



//Database Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/ITIDatabases")
  .then(() => {
    console.log("Connected Success...");
    app.listen(process.env.PortNumber, () => {
      console.log("Listening.....");
    }); //listen
  })
  .catch(() => console.log("ERROR CONNECTING TO THE DATABASE..."));
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "/index.html"));
});

/* First Middlewares */
app.use(morgan(":method :url"));

/* Routers */
// app.use(
//   multer({ storage: storage , fileFilter: imageFilter }).single("imageForm")
// );

app.use(body_parser.json()); //json
app.use(body_parser.urlencoded({ extended: false })); //form
app.use(authRouter);
app.use(speakerRouter);
app.use(eventRouter);
app.use(studentRouter);

/* Not Found Middlewares */
app.use((request, response) => {
  response.status(404).send("Page Not Found");
});

/* Error Middlewares */
app.use((error, request, response, next) => {
  let status = error.status || 500;
  response.status(status).send("something went wrong");
});
