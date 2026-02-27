const mongoose = require("mongoose");
require('dotenv').config();

const dbURL = process.env.DB_URL;
mongoose
  .connect(dbURL)
  .then(() => {
    console.log("db connected");
  })
  .catch((err) => {
    console.log("error in db ", err);
  });
