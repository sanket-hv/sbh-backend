const router = require("express").Router();
const { welcome } = require("../middleware/Auth");
const {
  getNewSalesNo,
  createSales,
  getAllSales,
  getSalesDetails,
  updateSalesDetails,
  updateSalesRoundAmount,
  deleteSales,
  deleteSalesDetailsItem,
  getPartyWiseProducts,
} = require("../controllers/Sales.controller");

router.get("/getNewSalesNo", welcome, getNewSalesNo);

router.post("/createSales", welcome, createSales);

router.post("/getAllSales", welcome, getAllSales);

router.post("/getSalesDetails", welcome, getSalesDetails);

router.put("/updateSalesDetails", welcome, updateSalesDetails);

router.put("/updateRoundAmount", updateSalesRoundAmount);

router.delete("/deleteSales", welcome, deleteSales);

router.delete("/deleteSalesDetailsItem", welcome, deleteSalesDetailsItem);

router.post("/getPartyWiseProducts", welcome, getPartyWiseProducts);

module.exports = router;
