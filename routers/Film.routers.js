const express = require('express');
const { checkExists } = require('../middleware/validations/checkExists')
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');

const { Films } = require('../models');
const { create, getAll, getDetails, deleteFilm, updateFilm } = require('../controllers/Film.controller');
const { uploadImage } = require('../middleware/uploads/upload-images');
const filmsRouter = express.Router();

filmsRouter.post('/', authentication, authorize, uploadImage("films"), create);
filmsRouter.get('/', getAll);
filmsRouter.get('/:id', checkExists(Films), getDetails);
filmsRouter.put('/:id', authentication, authorize, checkExists(Films), uploadImage('films'), updateFilm);
filmsRouter.delete('/:id', authentication, authorize, checkExists(Films), deleteFilm);

module.exports = {
    filmsRouter
}