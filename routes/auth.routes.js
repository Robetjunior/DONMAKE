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
      res.status(200).json(userFromDB);
    })
    .catch((error) => {
      console.log(error);
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
            return res.status(200).json(user);
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
  res.status(200).json({ message: "Loggout success" });
});

module.exports = router;
