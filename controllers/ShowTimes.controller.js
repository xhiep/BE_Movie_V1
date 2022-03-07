const { ShowTimes, Films, Cinemas, Rooms, sequelize } = require('../models');
const { QueryTypes } = require('sequelize');
const create = async (req, res) => {
    const { idFilm, showDate, idCinema, idRoom } = req.body;
    try {
        const newShowTimes = await ShowTimes.create({ idFilm, showDate, idCinema, idRoom });
        res.status(201).send({
            message: "Tạo lịch chiếu thành công",
            data: newShowTimes
        })
    } catch (error) {
        res.status(500).send(error);
    }
}
const getAll = async (req, res) => {
    const { name } = req.query;
    try {
        const listShowTimes = await sequelize.query(`select distinct showtimes.id ,films.nameFilm ,cinemas.name AS nameCinema ,groupcinemas.groupName ,rooms.roomName ,showDate ,showtimes.createdAt ,showtimes.updatedAt, count(*) as numberTicket
        from (((((showtimes 
        inner join films on showtimes.idFilm = films.id)
        inner join cinemas on showtimes.idCinema = cinemas.id)
        inner join rooms on showtimes.idRoom = rooms.id)
        inner join groupcinemas on cinemas.idGroupCinema = groupcinemas.id)
        inner join seats on showtimes.id = seats.idShowTime)
        where films.nameFilm like '%${name}%'
        group by seats.idShowTime`, { type: QueryTypes.SELECT })
        res.status(200).send(listShowTimes);

    } catch (error) {
        res.status(500).send(error);
    }
}
const getShowTimeWithIDCinemaIDFilm = async (req, res) => {
    const { idFilm, idCinema } = req.query;
    try {
        const lstShowDate = await sequelize.query(`
                select showtimes.id,  showDate
                from showtimes 
                inner join films on films.id = showtimes.idFilm
                inner join cinemas on cinemas.id = showtimes.idCinema
                where cinemas.id = ${idCinema} and films.id = ${idFilm}`, { type: QueryTypes.SELECT });
        res.status(200).send(lstShowDate);
    } catch (error) {
        res.status(500).send(error)
    }
}
const getDetails = async (req, res) => {
    const { id } = req.params;
    try {
        const details = await ShowTimes.findOne({
            where: {
                id,
            },
            include: [
                {
                    model: Films,
                    as: 'film'
                },
                {
                    model: Cinemas,
                    as: 'cinema'
                },
                {
                    model: Rooms,
                    as: 'room'
                }
            ]
        });
        details.idFilm = undefined;
        details.idCinema = undefined;
        details.idRoom = undefined;
        res.status(200).send(details);
    } catch (error) {
        res.status(500).send(error);
    }
}

const deleteShowTimes = async (req, res) => {
    try {
        const details = req.details;
        const showTimeDelete = await ShowTimes.findOne({
            where: {
                id: details.id,
            },
            include: [
                {
                    model: Films,
                    as: 'film'
                },
                {
                    model: Cinemas,
                    as: 'cinema'
                },
                {
                    model: Rooms,
                    as: 'room'
                }
            ]
        });
        await ShowTimes.destroy({ where: { id: details.id } });
        showTimeDelete.idFilm = undefined;
        showTimeDelete.idCinema = undefined;
        showTimeDelete.idRoom = undefined;
        res.status(200).send(showTimeDelete);
    } catch (error) {
        res.status(500).send(error);
    }
}
const update = async (req, res) => {
    const { idFilm, showDate, idCinema, idRoom } = req.body;
    const { details } = req;
    try {
        details.idFilm = idFilm;
        details.showDate = showDate;
        details.idCinema = idCinema;
        details.idRoom = idRoom;
        await details.save();
        const updated = await ShowTimes.findOne({
            where: {
                id: details.id
            },
            include: [
                {
                    model: Films,
                    as: 'film'
                },
                {
                    model: Rooms,
                    as: 'room'
                },
                {
                    model: Cinemas,
                    as: 'cinema'
                }
            ]
        });
        updated.idFilm = undefined;
        updated.idCinema = undefined;
        updated.idRoom = undefined;
        res.status(200).send({
            message: "Cập nhật lịch chiếu thành công",
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
    deleteShowTimes,
    update,
    getShowTimeWithIDCinemaIDFilm
}