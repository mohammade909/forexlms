const express = require("express");
const {
  getOffers,
  updateOffer,
  deleteOffer,
  createOffer,
} = require("../controllers/offersController");

const router = express.Router();

// Route to get all offers
router.get("/", getOffers);
router.post("/", createOffer);

// Route to update an offer by ID
router.put("/:id", updateOffer);

// Route to delete an offer by ID
router.delete("/:id", deleteOffer);

module.exports = router;
