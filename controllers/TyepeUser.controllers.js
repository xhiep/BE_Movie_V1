const { TypeUser } = require('../models');

const createTypeUser = async (req, res) => {
    const { nameType, type } = req.body;
    try {
        const checkType = await TypeUser.findOne({
            where: {
                type
            }
        });
        if (!checkType) {
            const newType = await TypeUser.create({ nameType, type });
            res.status(201).send(newType);
        } else {
            res.status(403).send("Loại người dùng đã tồn tại ");
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    try {
        const listUserType = await TypeUser.findAll();
        res.status(200).send(listUserType);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const details = await TypeUser.findOne({
            where: {
                id
            }
        });
        if (details) {
            res.status(200).send(details);
        } else {
            res.status(404).send(`Not Found ID =${id} `)
        }
    } catch (error) {
        res.status(500).send(error);
    }
}
const deleteTypeUser = async (req, res) => {
    const { id } = req.params;
    try {
        await TypeUser.destroy({
            where: {
                id
            }
        });
        res.status(200).send(req.details);
    } catch (error) {
        res.status(500).send(error);
    }
}
const update = async (req, res) => {
    const { nameType, type } = req.body;
    try {
        const typeUserUpdate = req.details;
        typeUserUpdate.nameType = nameType;
        typeUserUpdate.type = type;
        await typeUserUpdate.save();
        res.status(200).send(typeUserUpdate);

    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = {
    createTypeUser,
    getAll,
    getDetails,
    deleteTypeUser,
    update
}