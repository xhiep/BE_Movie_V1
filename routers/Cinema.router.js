const express = require('express');
const { Cinemas } = require('../models');
const { checkExists } = require('../middleware/validations/checkExists');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { uploadImage } = require('../middleware/uploads/upload-images');
const { create, getAll, getDetails, deleteCinemas, update } = require('../controllers/Cinema.controller');
const cinemasRouter = express.Router();

cinemasRouter.post('/', authentication, authorize, uploadImage("cinemas"), create);
cinemasRouter.get('/', getAll);
cinemasRouter.get('/:id', checkExists(Cinemas), getDetails);
cinemasRouter.delete('/:id', authentication, authorize, checkExists(Cinemas), deleteCinemas);
cinemasRouter.put('/:id', authentication, authorize, checkExists(Cinemas), uploadImage('cinemas'), update);


module.exports = {
    cinemasRouter
}