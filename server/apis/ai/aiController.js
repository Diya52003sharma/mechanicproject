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

    // ✅ use stable model
    const result = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              { text: prompt }
            ]
          }
        ]
      },
      {
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    console.log("Full Gemini response:", JSON.stringify(result.data, null, 2));

    // ✅ safer extraction
    const text =
      result?.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response from AI";

    res.send({
      success: true,
      response: text
    });

  } catch (err) {

    console.log("Gemini error:", err.response?.data || err.message);

    res.send({
      success: false,
      message: "AI failed",
      error: err.response?.data || err.message
    });
  }
};

module.exports = {
  generateAI
};