const express = require("express");
const controller = require("./../controllers/speakerControllers");
const router = express.Router();
const { body, param } = require("express-validator");
const authMW = require("./../middlewares/AuthrizationMW");
const path = require("path");
const multer = require("multer");
const upload = multer()


// var upload = multer({ storage: storage });
router
  .route("/speaker")
  .get(authMW, controller.getSpeaker)
  .post(upload.single('imageForm'),
    body("email").isEmail().withMessage("not valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Should be more 8 character"),
    body("fullName")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Name is Not Valid"), 
      controller.postSpeaker
  )
  .put(
    authMW,
    body("id").isMongoId().withMessage("Id Is Not Valid"),
    body("email").isEmail().withMessage("not valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Should be more 8 character"),
    body("fullName")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Name is Not Valid"),
    controller.putSpeaker
  )
  .delete(
    authMW,
    body("id").isMongoId().withMessage("Id Is Not Valid"),
    controller.deleteSpeaker
  );
router.get(
  "/speaker/:id",
  authMW,
  param("id").isMongoId().withMessage("Id Is Not Valid"),
  controller.getSpeakerById
);

module.exports = router;
