const { Server } = require("socket.io");
const { Seats, Rooms, Users, sequelize } = require("../../models");
const { QueryTypes } = require("sequelize");

const io = new Server();
const Socket = {
  emit: function (event, data) {
    // console.log(event, data);
    io.sockets.emit(event, data);
  },
  leave: function (event) {
    io.sockets.socketsLeave(event);
  },
  toEmit: function (event, data) {
    // console.log("socket in", data);
    io.sockets.to(event).emit("connectRoom", data);
  },
  on: function (event, data) {
    io.sockets.on(event, data);
  },
};

io.on("connection", function (socket) {
  // console.log("A user connected");
  //! join room
  socket.on("join-room", (data) => {
    // console.log(data);
    const { room, user } = data;
    socket.join(room);
    // console.log(`${user.userName} join ${room}`);
  });
  //! leave room
  socket.on("leaveRroom", async (data) => {
    const { room, user, seats } = data;
    console.log("----------------seats, seats", seats);
    let ids = [];
    seats.forEach((element) => {
      ids.push(element.id);
    });
    await Seats.update(
      { keepSeat: null },
      {
        where: {
          id: ids,
        },
      }
    );
    console.log("------------------", ids);
    socket.leave(room);
    socket.broadcast.to(room).emit("receive-order-seat", seats);
    // console.log("seats", seats);
    // console.log(`${username} leave ${room}`);
  });
  //! choice seat
  socket.on("choice-seat", async (data) => {
    // console.log(data, "data");
    const { room, seat, user } = data;
    // console.log(user);
    const _seat = await Seats.findOne({ where: { id: seat.id } });
    // console.log(_seat);
    if (_seat.keepSeat) {
      _seat.keepSeat = null;
    } else {
      _seat.keepSeat = user.id;
    }
    await _seat.save();
    socket.broadcast.to(room).emit("receive-order-seat", _seat);
    // console.log(`${user.userName} selected seat${seat.id} in room ${room}`);
  });
});

module.exports = {
  Socket,
  io,
};
