const { Tickets, Seats, Users, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const create = async (req, res) => {
    const { userId, listTicket } = req.body;
    try {
        let ticketSuccess = []
        for (const ticket of listTicket) {
            const seat = await Seats.findOne({ where: { id: ticket.id } });
            if (seat.bookded) {
                res.status(403).send("Ghế đã có người đặt");
            } else {
                const newTicket = await Tickets.create({ seatId: ticket.id, userId, price: ticket.price });
                if (newTicket) {
                    seat.idUser = userId;
                    seat.bookded = true;
                    await seat.save();
                    await ticketSuccess.push(seat);
                }
            }
        }
        res.status(201).send({
            message: "Đặt vé thành công",
            data: ticketSuccess
        })
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
const listTicketWithUser = async (req, res) => {
    const { id } = req.params;
    try {
        sequelize.query(`select distinct  showtimes.id as idShowTime , nameFilm , imgFilm, groupName , name as cinemaName, roomName ,showDate
        from ((((((showtimes
        inner join films on showtimes.idFilm =  films.id)
        inner join seats on showtimes.id =  seats.idShowTime)
        inner join rooms on showtimes.idRoom = rooms.id) 
        inner join tickets on seats.id =  tickets.seatId)
        inner join cinemas on showtimes.idCinema =  cinemas.id)
        inner join groupcinemas on cinemas.idGroupCinema =  groupcinemas.id)
        where tickets.userId =${id}`, { type: QueryTypes.SELECT })
            .then(async (data) => {
                let hacks = []
                for (const showtime of data) {
                    const lstTicket = await sequelize.query(`select  seats.id, seatName ,tickets.createdAt   
                    from ((showtimes
                    inner join seats on showtimes.id =  seats.idShowTime)
                    inner join tickets on seats.id =  tickets.seatId)
                    where showtimes.id = ${showtime.idShowTime} and tickets.userId = ${id}`, { type: QueryTypes.SELECT });
                    showtime.lstTicket = lstTicket;
                    hacks = [...hacks, showtime]
                }
                res.status(200).send(hacks)
            })

    } catch (error) {
        res.status(500).send(error);
    }

}
module.exports = {
    create,
    getTicketByIdUser,
    listTicketWithUser
}