const express = require("express");
const { Banner } = require("../models");

const {
  getAll,
  getDetail,
  createBanner,
  updateBanner,
  deleteBanner,
} = require("../controllers/Banner.controller");
const { authentication } = require("../middleware/auth/authentication");
const { authorize } = require("../middleware/auth/authorize");
const { uploadImage } = require("../middleware/uploads/upload-images");
const { checkExists } = require("../middleware/validations/checkExists");
const bannerRoute = express.Router();

bannerRoute.get("/", getAll);
bannerRoute.get(
  "/:id",
  authentication,
  authorize,
  checkExists(Banner),
  getDetail
);
bannerRoute.post(
  "/",
  authentication,
  authorize,
  uploadImage("banner"),
  createBanner
);
bannerRoute.put(
  "/:id",
  authentication,
  authorize,
  checkExists(Banner),
  uploadImage("banner"),
  updateBanner
);

bannerRoute.delete(
  "/:id",
  authentication,
  authorize,
  checkExists(Banner),
  deleteBanner
);

module.exports = {
  bannerRoute,
};
