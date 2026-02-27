const express = require("express");

const app = express();
const cors = require("cors");

const port = 5000;
app.use(cors());
const path = require("path");

const path = require("path");

app.use(express.static(path.join(__dirname, "dist")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

const db = require("./server/config/db");
const seed = require("./server/config/seed");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("welcome to my server");
});

const adminRoutes = require("./server/routes/adminRoutes");
app.use("/admin", adminRoutes);

const aiRoutes = require("./server/routes/aiRoutes");
app.use("/api/ai", aiRoutes);

const customerRoutes = require("./server/routes/customerRoutes");
app.use("/customer", customerRoutes);

const mechanicRoutes = require("./server/routes/mechanicRoutes");
app.use("/mechanic", mechanicRoutes);

const commonRoutes = require("./server/routes/commonRoutes");
app.use("/", commonRoutes);

app.listen(port, (err) => {
  if (err) {
    console.log("error in server", err);
  } else {
    console.log("Server is running at port", port);
  }
});
