const { Seats, Rooms } = require('../models');

const create = async (req, res) => {
    const { price, idRoom, idShowTime } = req.body;
    try {
        const detailsRoom = await Rooms.findOne({ where: { id: idRoom } });
        if (detailsRoom) {
            const createLstSeat = async (detailsRoom) => {
                let lstSeat = [];
                for (let i = 1; i <= detailsRoom.maxSeat; i++) {
                    const newSeat = await Seats.create({ seatName: `${i}`, price, idRoom, idShowTime });
                    lstSeat.push(newSeat);
                }
                return lstSeat;
            };
            const lst = await createLstSeat(detailsRoom);
            res.status(201).send(lst);
        } else {
            res.status(403).send("Không có phòng trên");
        }

    } catch (error) {
        res.status(500).send(error);
    }
}
const getByIdShowTime = async (req, res) => {
    const { id } = req.params;
    try {
        const lstSeat = await Seats.findAll({ where: { idShowTime: id } });
        res.status(200).send(lstSeat);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    create,
    getByIdShowTime
}