const router = require("express").Router();
const { welcome } = require("../middleware/Auth");
const {
  createParty,
  getAllParties,
  getPartyDetails,
  validatePartyDetails,
  deleteParty,
  updatePartyDetails,
} = require("../controllers/Party.controller");

/* const {
  partyValidators: { partyCreateValidator },
} = require("../validators");
const {
  validatorErrorResponse,
} = require("../middleware/validatorErrorResponse");

router.post(
  "/",
  welcome,
  partyCreateValidator,
  validatorErrorResponse,
  createParty
); */

router.post("/", welcome, createParty);

router.get("/", welcome, getAllParties);

router.get("/:partyId", welcome, getPartyDetails);

router.put("/:partyId", welcome, updatePartyDetails);

router.post("/validate", welcome, validatePartyDetails);

router.delete("/", welcome, deleteParty);

module.exports = router;
