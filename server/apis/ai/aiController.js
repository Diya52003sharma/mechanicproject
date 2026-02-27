const axios = require("axios");

const generateAI = async (req, res) => {
  try {

    const { prompt } = req.body;

    if (!prompt) {
      return res.send({
        success: false,
        message: "Prompt required"
      });
    }

   const result = await axios.post(
  `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
  {
    contents: [
      {
        parts: [
          { text: prompt }
        ]
      }
    ]
  }
);

    const text =
      result?.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    res.send({
      success: true,
      response: text
    });

  } catch (err) {

    console.log("Gemini error:", err.response?.data || err.message);

    res.send({
      success: false,
      message: "AI failed"
    });
  }
};

module.exports = {
  generateAI
};