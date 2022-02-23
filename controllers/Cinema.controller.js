const { GroupCinemas, Cinemas } = require('../models');
const { PORT } = require('../utils/util');

const create = async (req, res) => {
    const { file, body } = req;
    const data = JSON.parse(body.dataCinema);
    const { idGroupCinema, name, address } = data;
    try {
        if (file?.path) {
            const logo = `localhost:${PORT}/${file.path}`
            const newCinema = await Cinemas.create({ idGroupCinema, name, address, logo });
            res.status(201).send({
                message: "Thêm  rạp thành công",
                data: newCinema
            })
        } else {
            res.status(403).send("Bạn cần chọn ảnh để thêm  rạp chiếu");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    try {
        const lstCinemas = await Cinemas.findAll({
            include: [
                {
                    model: GroupCinemas,
                    as: 'group'
                }
            ]
        });
        lstCinemas.forEach(element => {
            element.idGroupCinema = undefined;
        });
        res.status(200).send(lstCinemas);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const cinemas = await Cinemas.findOne({
            where: {
                id
            },
            include: [
                {
                    model: GroupCinemas,
                    as: 'group'
                }
            ]
        });
        cinemas.idGroupCinema = undefined;
        res.status(200).send(cinemas);
    } catch (error) {
        res.status(500).send(error);
    }
}
const deleteCinemas = async (req, res) => {
    const { id } = req.params;
    try {
        const cinemas = await Cinemas.findOne({
            where: {
                id
            },
            include: [
                {
                    model: GroupCinemas,
                    as: 'group'
                }
            ]
        });
        cinemas.idGroupCinema = undefined;
        await Cinemas.destroy({ where: { id } });
        res.status(200).send(cinemas);
    } catch (error) {
        res.status(500).send(error);
    }
}
const update = async (req, res) => {
    const { file, body, details } = req;
    const { id } = req.params;
    const data = JSON.parse(body.dataCinema);
    const { idGroupCinema, name, address } = data;
    try {
        if (file?.path) {
            const logo = `localhost:${PORT}/${file.path}`
            details.idGroupCinema = idGroupCinema;
            details.name = name;
            details.address = address;
            details.logo = logo;
            await details.save();
            const updated = await Cinemas.findOne({
                where: {
                    id
                },
                include: [
                    {
                        model: GroupCinemas,
                        as: 'group'
                    }
                ]
            });
            updated.idGroupCinema = undefined;
            res.status(200).send({
                message: "Cập nhật thành công",
                data: updated
            })
        } else {
            res.status(403).send("Bạn cần gửi ảnh");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = {
    create,
    getAll,
    getDetails,
    deleteCinemas,
    update
}
