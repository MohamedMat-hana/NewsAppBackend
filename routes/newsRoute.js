const express = require("express");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  addNews,
  getAllNews,
  getNewsById,
  getSliderNews,
  getNewsByCategory,
  deleteNewsById,
  editNews
} = require("../controllers/newsController");

router.route("/addNews").post(protect, addNews);
router.route("/getAllNews/:pageNo/:pageSize").get(getAllNews);
// getSliderNews

 router.route("/getNewsById/:newsId").get(getNewsById);
router.route("/getAllNews/slider").get(getSliderNews);
router.route("/getNewsByCategory/:catId").get(getNewsByCategory);
router.route("/deleteNewsById/:newsId").delete(protect,deleteNewsById);
router.route("/editNews/:newsId").put(protect,editNews);

module.exports = router;
