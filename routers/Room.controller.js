const express = require('express');
const { Rooms } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { create, getAll, getDetails, deleteRoom, update } = require('../controllers/Room.controller');

const roomRouter = express.Router();
roomRouter.post('/', authentication, authorize, create);
roomRouter.get('/', getAll);
roomRouter.get('/:id', checkExists(Rooms), getDetails);
roomRouter.delete('/:id', authentication, authorize, checkExists(Rooms), deleteRoom);
roomRouter.put('/:id', authentication, authorize, checkExists(Rooms), update);
module.exports = {
    roomRouter
}