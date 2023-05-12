const { Banners, sequelize } = require("../models");

const createBanner = async (req, res) => {
  const { file } = req;
  try {
    if (file?.path) {
      const imgBanner = await file.path.replace(/\\/g, "/");
      const _banner = await Banners.create({
        image: imgBanner,
      });
      res.status(201).send(_banner);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
const getAll = async (req, res) => {
  try {
    const lstBanner = await Banners.findAll({ where: { isActive: true } });
    res.status(200).send(lstBanner);
  } catch (error) {
    res.status(500).send(error);
  }
};
const getDetail = async (req, res) => {
  const { detail } = req;
  try {
    res.status(200).send(detail);
  } catch (error) {
    res.status(500).send(error);
  }
};
const deleteBanner = async (req, res) => {
  const { detail } = req;
  try {
    detail.isActive = false;
    await detail.save();
    res.status(200).send(detail);
  } catch (error) {
    res.status(500).send(error);
  }
};
const updateBanner = async (req, res) => {
  const { detail, file } = req;
  try {
    if (file?.path) {
      const imgBanner = await file.path.replace(/\\/g, "/");
      detail.image = imgBanner;
      await detail.save();
      res.status(200).send(detail);
    }
  } catch (error) {
    res.status(500).send(error);
  }
};
module.exports = {
  createBanner,
  getAll,
  getDetail,
  deleteBanner,
  updateBanner,
};
