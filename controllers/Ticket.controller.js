const { Tickets, Seats, Users } = require('../models');

const create = async (req, res) => {
    const { seatId, price, userId } = req.body;
    try {
        const seat = await Seats.findOne({ where: { id: seatId } });
        if (seat.bookded) {
            res.status(403).send("Ghế đã có người đặt");
        } else {
            const newTicket = await Tickets.create({ seatId, userId, price });
            if (newTicket) {
                seat.idUser = userId;
                seat.bookded = true;
                await seat.save();
                res.status(201).send({
                    message: "Đặt vé thành công",
                    data: newTicket
                })
            } else {
                res.status(403).send("Đặt vé thất bại");
            }
        }
    } catch (error) {
        res.status(500).send(error);
    }
}

const getTicketByIdUser = async (req, res) => {
    const { id } = req.params;
    try {
        const lstTicket = await Tickets.findAll({
            where: {
                userId: id
            },
            include: [
                {
                    model: Users,
                    as: 'user'
                },
                {
                    model: Seats,
                    as: 'seat'
                }
            ]
        });
        lstTicket.forEach(element => {
            element.seatId = undefined;
            element.userId = undefined;
        });
        res.status(200).send(lstTicket)
    } catch (error) {
        res.status(500).send(error);
    }
}
module.exports = {
    create,
    getTicketByIdUser
}