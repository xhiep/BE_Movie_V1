const express = require('express');
const { ShowTimes } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { create, getAll, getDetails, deleteShowTimes, update } = require('../controllers/ShowTimes.controller');

const showTimeRouter = express.Router();

showTimeRouter.post('/', authentication, authorize, create);
showTimeRouter.get('/', getAll);
showTimeRouter.get('/:id', checkExists(ShowTimes), getDetails);
showTimeRouter.delete('/:id', authentication, authorize, checkExists(ShowTimes), deleteShowTimes);
showTimeRouter.put('/:id', authentication, authorize, checkExists(ShowTimes), update);


module.exports = {
    showTimeRouter
}