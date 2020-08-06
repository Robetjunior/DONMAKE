const express = require("express");
const router = express.Router();
const Ong = require("../models/Ong.model");
const Announcement = require("../models/Announcement.model");

// Protegendo rota privada
router.get("/ong/profile", async (req, res) => {
  console.log("your sess exp: ", req.session.cookie.expires);

  if (req.session.currentUser) {
    try {
      const userID = req.session.currentUser._id;

      const response = await Announcement.find({ _id: userID });

      const responseOng = await Ong.find({ _id: userID });

      res.status(200).json([...responseOng, ...response]);

    } catch (err) {
      console.log("Error: " ,err);
      res.status(302).json("OFF!!");
    }
  }

});

//Edit/update Ong information
router.patch("/ong/profile/:id", async (req, res) => {
  const { email, address, phone, cnpj } = req.body;
  const { id } = req.params;
  try {
    if (!email || !address || !phone || !cnpj) {
      return res
        .status(400)
        .json({ message: "Please provide all informations" });
    }
    const result = await Ong.updateOne({ _id: id }, req.body);
    res.status(200).json(result);
  } catch (err) {
    throw new Error(err);
  }
});
module.exports = router;
