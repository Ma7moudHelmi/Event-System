const express = require("express");
const controller = require("./../controllers/authenticationController");

const router = express.Router();
const app = express();

router.post("/login", controller.addLogin);
router.post("/registerStudent", controller.registerStudent);
router.post("/registerSpeaker",controller.registerSpeaker);

module.exports = router;
