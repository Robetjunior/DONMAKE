require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const mongoose = require("mongoose");
const logger = require("morgan");
const cors = require("cors");
const path = require("path");

mongoose
  .connect(process.env.MONGODB_URI, {
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

app.use(express.static(path.join(__dirname, "public")));

// ADD CORS SETTINGS HERE TO ALLOW CROSS-ORIGIN INTERACTION:

app.use(
  cors({
    credentials: true,
    origin: [process.env.CORS_ORIGIN],
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

// app.use((req, res, next) => {
//   res.sendFile(__dirname + "/public/index.html");
// });

module.exports = app;
