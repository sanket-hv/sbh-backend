const router = require("express").Router();

const { createUser, deleteUser } = require("../../controllers/AdminPanel");

// User Routes
router.post("/create", createUser);
router.delete("/delete", deleteUser);

module.exports = router;
