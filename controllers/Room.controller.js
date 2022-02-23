const { Rooms, Cinemas } = require('../models');

const create = async (req, res) => {
    const { roomName, idCinema, maxSeat } = req.body;
    try {
        const newRoom = await Rooms.create({ roomName, idCinema, maxSeat });
        res.status(201).send(newRoom);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    try {
        const lstRoom = await Rooms.findAll({
            include: [
                {
                    model: Cinemas,
                    as: 'cinema_room'
                }
            ]
        });
        lstRoom.forEach(element => {
            element.idCinema = undefined;
        });
        res.status(200).send(lstRoom);
    } catch (error) {
        res.status(500).send(error);
    }
}
const getDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const roomDetails = await Rooms.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Cinemas,
                    as: 'cinema_room'
                }
            ]
        });
        roomDetails.idCinema = undefined;
        res.status(200).send(roomDetails);
    } catch (error) {
        res.status(500).send(error);
    }
}
const deleteRoom = async (req, res) => {
    const { id } = req.params;
    try {
        const roomDetails = await Rooms.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Cinemas,
                    as: 'cinema_room'
                }
            ]
        });
        await Rooms.destroy({ where: { id } })
        res.status(200).send(roomDetails)
    } catch (error) {
        res.status(500).send(error);
    }
}
const update = async (req, res) => {
    const { id } = req.params;
    const { roomName, idCinema, maxSeat } = req.body;
    try {
        const details = req.details;
        details.roomName = roomName;
        details.idCinema = idCinema;
        details.maxSeat = maxSeat;
        await details.save();
        const updated = await Rooms.findOne({
            where: {
                id
            },
            include: [
                {
                    model: Cinemas,
                    as: 'cinema_room'
                }
            ]
        });
        res.status(200).send({
            message: "Cập nhật thành công",
            data: updated
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = {
    create,
    getAll,
    getDetails,
    deleteRoom,
    update
}