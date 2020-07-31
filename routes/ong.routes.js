const express = require("express");
const router = express.Router();

const Ong = require("../models/Ong.model");
// const Announcement = require('../models/Announcement.model')

router.get("/ong/profile", async (req, res) => {
  try {
    const findOng = await Ong.find().populate("adId").exec();

    res.status(200).json(findOng);
  } catch (err) {
    throw new Error(err);
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
