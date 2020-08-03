const { Router } = require("express");
const router = new Router();
const bcryptjs = require("bcryptjs");
const saltRounds = 10;
const Ong = require("../models/Ong.model");
const Announcement = require("../models/Announcement.model");
const mongoose = require("mongoose");
//verifica se o user existe, e cadastrando novo user
router.post("/signup", (req, res, next) => {
  const { username, email, password, address, phone, cnpj } = req.body;
  console.log(username);
  if (!username || !email || !password || !address || !phone || !cnpj) {
    res.status(404).json({ message: "prencha todos os campos" });
    return;
  }
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(password)) {
    res.status(500).json({
      errorMessage:
        "Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.",
    });
    return;
  }
  bcryptjs
    .genSalt(saltRounds)
    .then((salt) => bcryptjs.hash(password, salt))
    .then((hashedPassword) => {
      return Ong.create({
        name: username,
        email,
        passwordHash: hashedPassword,
        address,
        phone,
        cnpj,
      });
    })
    .then((userFromDB) => {
      console.log("Newly created user is: ", userFromDB);
      res.redirect("/ong/profile");
    })
    .catch((error) => {
      if (error instanceof mongoose.Error.ValidationError) {
        res.status(500).json({ errorMessage: error.message });
      } else if (error.code === 11000) {
        res.status(500).json({
          errorMessage:
            "Username and email need to be unique. Either username or email is already used.",
        });
      } else {
        next(error);
      }
    });
});
//Buscando o user e vendo se ele existe
router.post("/login", (req, res, next) => {
  const { email, password } = req.body;
  if (email === "" || password === "") {
    res.json({
      errorMessage: "Please enter both, email and password to login.",
    });
    return;
  }
  Ong.findOne({ email })
    .then((user) => {
      if (!user) {
        res.json({
          errorMessage: "Email is not registered. Try with other email.",
        });
        return;
      }
      bcryptjs
        .compare(password, user.passwordHash)
        .then((success) => {
          if (success) {
            req.session.currentUser = user;
            return res.redirect("/ong/profile");
          }
          res.json({ errorMessage: "Incorrect password." });
        })
        .catch((err) => {
          throw new Error(err);
        });
    })
    .catch((error) => next(error));
});
//Logout
router.post("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});
// Protegendo rota privada
router.get("/ong/profile", async (req, res) => {
  console.log("your sess exp: ", req.session.cookie.expires);
  if (req.session.currentUser) {
    const user = req.session.currentUser._id;
    try {
      const findOng = await Ong.find().populate("adId").exec();
      res.status(200).json(findOng, user);
    } catch (err) {
      throw new Error(err);
    }
  }
  res.redirect("/login");
});
module.exports = router;
