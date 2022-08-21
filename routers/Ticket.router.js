const express = require('express');
const { Tickets, Users } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { create, getTicketByIdUser, listTicketWithUser, getToTalWithMonth, getTicketWithUser } = require('../controllers/Ticket.controller');
const { checkUserBlock } = require('../middleware/validations/checkUserBlock');
const ticketRouter = express.Router();

ticketRouter.get('/total', authentication, authorize, getToTalWithMonth);
ticketRouter.post('/', authentication, create);
ticketRouter.get('/:id', authentication, getTicketByIdUser);
ticketRouter.get('/listTicket/:id', authentication, checkExists(Users), listTicketWithUser)



module.exports = {
    ticketRouter
}