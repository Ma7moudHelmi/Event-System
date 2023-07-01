const express = require("express");
const controller = require("./../controllers/studentControllers");
const router = express.Router();
const { body, param } = require("express-validator");
const authMW = require("./../middlewares/AuthrizationMW");

router
  .route("/students")
  .get(authMW, controller.getStudent)
  .post(
    authMW,
    //body("id").isInt().withMessage("Id Is Not Valid"),
    body("email").isEmail().withMessage("not valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Should be more 8 character"),
    body("fullName")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Name is Not Valid"),
    controller.postStudent
  )
  .put(
    authMW,
    body("id").isInt().withMessage("Id Is Not Valid"),
    body("email").isEmail().withMessage("not valid email"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password Should be more 8 character"),
    body("fullName")
      .isAlpha("en-US", { ignore: " " })
      .withMessage("Name is Not Valid"),
    controller.putStudent
  )
  .delete(
    authMW,
    body("id").isInt().withMessage("Id Is Not Valid"),
    controller.deleteStudent
  );
router.get(
  "/students/:id",
  authMW,
  param("id").isInt().withMessage("Id Is Not Valid"),
  controller.getStudentById
);

module.exports = router;
