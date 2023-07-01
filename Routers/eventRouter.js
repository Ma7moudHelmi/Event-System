const express = require("express");
const controller = require("./../controllers/eventController");
const { body, param } = require("express-validator");
const router = express.Router();
const authMW = require("./../middlewares/AuthrizationMW");

router
  .route("/event")
  .get(authMW, controller.getEvent)
  .post(
    authMW,
    // body("id").isInt().withMessage("event id should be integer"),
    body("title")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("not valid title"),
    body("eventDate")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("Date is Not Valid"),
    body("mainSpeaker").isMongoId().withMessage("main Speaker ID is Not Valid"),
    body("speakersId").isMongoId().withMessage("Speaker ID is Not Valid"),
    body("studentsId").isInt().withMessage("student id should be integer"),
    controller.postEvent
  )
  .put(
    authMW,
    body("id").isInt().withMessage("event id should be integer"),
    body("title")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("not valid title"),
    body("eventDate")
      .isDate({ format: "YYYY-MM-DD" })
      .withMessage("Date is Not Valid"),
    body("mainSpeaker").isMongoId().withMessage("main Speaker ID is Not Valid"),
    body("speakersId").isMongoId().withMessage("Speaker ID is Not Valid"),
    body("studentsId").isInt().withMessage("student id should be integer"),
    controller.putEvent
  )
  .delete(
    authMW,
    body("id").isInt().withMessage("Event id not valid"),
    controller.deleteEvent
  );
router.get(
  "/event/:id",
  authMW,
  param("id").isInt().withMessage("Event id not valid"),
  controller.getEventById
);

module.exports = router;
