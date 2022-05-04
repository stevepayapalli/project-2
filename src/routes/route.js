const express = require('express');
const router = express.Router();
const cc = require ("../controllers/collegeControllers")
const ci = require("../controllers/internControllers")

router.post("/functionup/colleges", cc.createCollege)

router.post("/functionup/interns", ci.createIntern)

router.get("/functionup/collegeDetails", cc.collegeDetails)

module.exports = router;