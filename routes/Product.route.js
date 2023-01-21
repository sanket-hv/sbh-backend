const router = require("express").Router();
const { welcome } = require("../middleware/Auth");
const {
  createProduct,
  getAllProducts,
  getProductDetails,
  updateProductDetails,
  deleteProduct,
} = require("../controllers/Product.controller");

router.post("/", welcome, createProduct);

router.get("/", welcome, getAllProducts);

router.get("/:productId", welcome, getProductDetails);

router.put("/:productId", welcome, updateProductDetails);

router.delete("/", welcome, deleteProduct);

module.exports = router;
