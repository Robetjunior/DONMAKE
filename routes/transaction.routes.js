const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction.model");
const Ong = require("../models/Ong.model");

// Envio de transação

router.post("/transaction/create", async (req, res) => {
  try {
    const { firstName, lastName, email, phone, value } = req.body;

    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !value
    ) {
      return res
        .status(400)
        .json({ message: "Please provide all informations" });
    }
    const response = await Transaction.create({
      firstName,
      lastName,
      email,
      phone,
      value,
      announcement: Announcement,
    });
    const findAnu = await Announcement.updateOne(
      { _id: announcement },
      { $push: { transaction: response._id } }
    );
    res.status(201).json({ response, findAnu });
  } catch (err) {
    throw new Error(err);
  }
});

router.get("/transaction/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const response = await Transaction.findOne({ _id: id });
    return res.status(200).json(response);
  } catch (err) {
    throw new Error(err);
  }
});

// router.get("/transactions", async (req, res)=> {
//   try{
//     const response = await Announcement.find().populate("transaction").exec()
//     return res.status(200).json(response)
//   }
//   catch(err) {
//     throw new Error(err);
//   }
// })
module.exports = router;
