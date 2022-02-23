const { Op } = require('sequelize');
const { Films } = require('../models');
const { PORT } = require('../utils/util');


const create = async (req, res) => {
    const { file, body } = req;
    const { nameFilm, trailer, description, showtime, rate, comingSoon, nowShowing } = body;
    try {
        if (file?.path) {
            const imgFilm = await file.path.replace(/\\/g, '/');
            const newFilm = await Films.create({ nameFilm, showtime, imgFilm, trailer, description, rate, comingSoon, nowShowing });
            res.status(201).send({
                message: "Thêm Phim thành công",
                data: newFilm
            })
        } else {
            res.status(403).send("Bạn cần gửi ảnh lên để thêm phim");
        }

    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    const { name } = req.query;
    try {
        let listFilm;
        if (name) {
            listFilm = await Films.findAll({
                where: {
                    nameFilm: {
                        [Op.like]: `%${name}%`
                    }
                }
            });
        } else {
            listFilm = await Films.findAll();
        }
        res.status(200).send(listFilm)
    } catch (error) {
        res.status(500).send(error);
    }
}
const getDetails = async (req, res) => {
    try {
        res.status(200).send(req.details);
    } catch (error) {
        res.status(500).send(error);
    }
}
const deleteFilm = async (req, res) => {
    try {
        const filmDel = req.details;
        await Films.destroy({ where: { id: filmDel.id } });
        res.status(200).send(filmDel);
    } catch (error) {
        res.status(500).send(error);
    }
}
const updateFilm = async (req, res) => {
    const { file, body } = req;
    const { nameFilm, trailer, description, showtime, rate, comingSoon, nowShowing } = body;
    try {
        const filmUpdate = req.details;
        let imgFilm;
        if (!file) {
            imgFilm = filmUpdate.imgFilm;
        } else {
            imgFilm = file.path.replace(/\\/g, '/');

        }
        filmUpdate.nameFilm = nameFilm;
        filmUpdate.trailer = trailer;
        filmUpdate.description = description;
        filmUpdate.rate = rate;
        filmUpdate.showtime = showtime;
        filmUpdate.comingSoon = comingSoon;
        filmUpdate.nowShowing = nowShowing;
        filmUpdate.imgFilm = imgFilm;
        await filmUpdate.save();
        res.status(200).send({
            message: "Cập nhập Phim thành công",
            data: filmUpdate
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = {
    create,
    getAll,
    getDetails,
    deleteFilm,
    updateFilm
}