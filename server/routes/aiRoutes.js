const express = require("express");
const router = express.Router();

const { generateAI } = require("../apis/ai/aiController");

router.post("/generate", generateAI);

module.exports = router;