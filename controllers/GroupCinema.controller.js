const { GroupCinemas } = require('../models');
const { PORT } = require('../utils/util');

const create = async (req, res) => {
    const { file, body } = req;
    const data = JSON.parse(body.dataGrCinema);
    const { groupName } = data;
    try {
        if (file?.path) {
            const logo = `localhost:${PORT}/${file.path}`
            const newGroupCinema = await GroupCinemas.create({ groupName, logo });
            res.status(201).send({
                message: "Thêm Rạp Chiếu thành công",
                data: newGroupCinema
            })
        } else {
            res.status(403).send("Bạn cần gửi ảnh lên để thêm rạp chiếu");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    try {
        const lstCinemas = await GroupCinemas.findAll();
        res.status(200).send(lstCinemas);
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
const deleteGrCinemas = async (req, res) => {
    try {
        const delCinemas = req.details;
        await GroupCinemas.destroy({ where: { id: delCinemas.id } });
        res.status(200).send({
            message: "Xóa Rạp thành công",
            data: delCinemas
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
const update = async (req, res) => {
    const { file, body, details } = req;
    const data = JSON.parse(body.dataGrCinema);
    const { groupName } = data;
    try {
        if (file?.path) {
            const logo = `localhost:${PORT}/${file.path}`
            details.groupName = groupName;
            details.logo = logo;
            await details.save();
            res.status(201).send({
                message: "Thêm Cụm Rạp Chiếu thành công",
                data: details
            })
        } else {
            res.status(403).send("Bạn cần gửi ảnh lên để thêm cụm rạp chiếu");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    create,
    getAll,
    getDetails,
    deleteGrCinemas,
    update
}