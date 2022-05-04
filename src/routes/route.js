const express = require('express');
const router = express.Router();
const cc = require ("../controllers/collegeControllers")


router.post("/functionup/colleges", cc.createCollege)

router.post("/functionup/interns", )

module.exports = router;