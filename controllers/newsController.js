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

module.exports = {
  addNews,
};
