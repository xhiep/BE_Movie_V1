const { Seats, Rooms, Users, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');

const create = async (req, res) => {
    const { price, idRoom, idShowTime } = req.body;
    try {
        const detailsSeats = await Seats.findOne({ where: { idShowTime } })
        if (!detailsSeats) {
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
        } else {
            res.status(403).send("Lịch chiếu này đã có vé")
        }


    } catch (error) {
        res.status(500).send(error);
    }
}

const getByIdShowTime = async (req, res) => {
    const { id } = req.query;
    try {
        const film = await sequelize.query(`select films.id , nameFilm ,groupName, name as rapChieu,  trailer , imgFilm , description , rate , comingSoon , nowShowing , showDate
        from (((films
        inner join showtimes on films.id = showtimes.idFilm)
        inner join cinemas on cinemas.id = showtimes.idCinema)
        inner join groupcinemas on groupcinemas.id =  cinemas.idGroupCinema)
        where showtimes.id = ${id}`, { type: QueryTypes.SELECT });

        const lstSeat = await Seats.findAll({
            where: {
                idShowTime: id
            },
            include: [
                {
                    model: Users,
                    as: 'idUsers'
                }

            ]
        });
        lstSeat.forEach(element => {
            element.idUser = undefined;
        });
        const phongVe = {
            film: film[0],
            lstGhe: lstSeat
        }
        res.status(200).send(phongVe);
    } catch (error) {
        res.status(500).send(error);
    }
}

module.exports = {
    create,
    getByIdShowTime
}