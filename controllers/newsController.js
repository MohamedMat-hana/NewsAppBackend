const News = require("../models/NewsModal");
const ImageToBase64 = require("image-to-base64");

const addNews = async (req, res, next) => {
  try {
    console.log(req.body);
    const { title, category, author, content, addToSlider } = req.body;

    if (!req.files || !req.files.newsImage || !req.files.newsImage.path) {
      return res
        .status(400)
        .json({ success: false, message: "Image file is missing" });
    }

    const base64Data = await ImageToBase64(req.files.newsImage.path);

    const news = await News.create({
      author,
      content,
      category,
      addToSlider,
      newsImage: `data:${
        req.files.newsImage.type || "image/png"
      };base64,${base64Data}`,
      addedAt: Date.now(),
    });

    if (news) {
      res
        .status(201)
        .json({ msg: "News Added Successfully", success: true, data: news });
    } else {
      res.status(400).json({ msg: "Invalid News Data", success: false });
    }
  } catch (error) {
    console.error("Error in addNews:", error);
    res.status(500).json({
      success: false,
      message: "internal error occured.",
    });
  }
};

const getAllNews = async (req, res, next) => {
  try {
    const size = req.params.pageSize;
    const pageNo = req.params.pageNo;
    var query = {};

    if (pageNo < 0 || pageNo === 0) {
      return res.status(400).json({
        success: false,
        msg: "Invalid Page Number, should start with 1",
      });
    }
    query.skip = size * (pageNo - 1);
    query.limit = size;
    const newsCount = await News.find({});
    const news = await News.find({})
      .sort("-addedAt")
      .populate({ path: "category", select: ["_id", "category_name"] })
      .limit(Number(query.limit))
      .skip(Number(query.skip));
    res.json({
      success: true,
      count: newsCount.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal error occured.",
    });
  }
};

const getNewsById = async (req, res, next) => {
  try {
    const news = await News.findById(req.params.newsId).populate({
      path: "category",
      select: ["_id", "category_name"],
    });
    res.json({
      success: true,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal error occured.",
    });
  }
};

const getSliderNews = async (req, res, next) => {
  try {
    const news = await News.find({addToSlider:true}).populate({
      path: "category",
      select: ["_id", "category_name"],
    });
    res.json({
      success: true,
      count:news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal error occured.",
    });
  }
};

const getNewsByCategory = async (req, res, next) => {
  try {
    const news = await News.find({category:req.params.catId}).populate({
      path: "category",
      select: ["_id", "category_name"],
    });

    res.json({
      success: true,
      count:news.length,
      data: news,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal error occured.",
    });
  }
};
const deleteNewsById = async (req, res, next) => {
  try {
    const news = await News.findByIdAndDelete(req.params.newsId);

    res.status(201).json({
      success: true,
      message: "news deleted successfully",
      data: news,
    });

    if (!news) {
      return res.status(401).json({
        success: false,
        message: "news not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal error occured.",
    });
  }
};


const editNews = async (req, res, next) => {
  try {
    const news = await News.findByIdAndUpdate(
      req.params.newsId,
      req.body,
      {
        new: true,
        runValidators:true
      }
    );
    res.status(201).json({
      success: true,
      message: "News updated successfully",
      data: news,
    });

    if (!news) {
      return res.status(401).json({
        success: false,
        message: "news not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "internal error occured.",
     });
  }
};
module.exports = {
  addNews,
  getAllNews,
  getNewsById,
  getSliderNews,
  getNewsByCategory,
  deleteNewsById,
  editNews
};
