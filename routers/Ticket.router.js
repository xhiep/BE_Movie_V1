const express = require('express');
const { Tickets } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { create, getTicketByIdUser } = require('../controllers/Ticket.controller');
const ticketRouter = express.Router();

ticketRouter.post('/', authentication, create);
ticketRouter.get('/:id', authentication, getTicketByIdUser);

module.exports = {
    ticketRouter
}