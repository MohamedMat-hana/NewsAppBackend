const express=require("express")
const router= express.Router();
const protect = require("../middleware/authMiddleware");
const { addNews } = require("../controllers/newsController");

router.route("/addNews").post(protect,addNews)
module.exports=router;