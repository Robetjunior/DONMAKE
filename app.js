require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const cors = require("cors");

mongoose
  .connect("mongodb://localhost/project3", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// ADD SESSION SETTINGS HERE:

require("./configs/session")(app);

// default value for title local
app.locals.title = "Projeto";

// ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:

app.use(
  cors({
    credentials: true,
    origin: ["http://localhost:3000"],
  })
);

// ROUTES MIDDLEWARE STARTS HERE:
const announcementRoutes = require("./routes/announcement.routes");
const transactionsRoutes = require("./routes/transaction.routes");
const ongRoutes = require("./routes/ong.routes");
const authRoutes = require("./routes/auth.routes");

app.use("/api", announcementRoutes);
app.use("/api", transactionsRoutes);
app.use("/api", ongRoutes);
app.use("/api", authRoutes);

module.exports = app;
