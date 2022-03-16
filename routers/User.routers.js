const express = require('express');
const { Users } = require('../models');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const { checkExists } = require('../middleware/validations/checkExists');
const { checkActive } = require('../middleware/validations/checkActive');
const { signUp, signIn, updateUser, getAllUser, getDetailsUser, deleteUser, BlockAndUnBlock, getUserWithShowTimeID } = require('../controllers/User.controllers');
const { uploadImage } = require('../middleware/uploads/upload-images');
const userRouter = express.Router();

userRouter.post('/signUp', signUp);
userRouter.post('/signIn', signIn);
userRouter.put('/:id', authentication, checkExists(Users), checkActive(Users), uploadImage('avatar'), updateUser);
userRouter.put('/block/:id', authentication, authorize, checkExists(Users), BlockAndUnBlock);
userRouter.get('/userWithShowTime', getUserWithShowTimeID)
userRouter.get('/', authentication, authorize, getAllUser);
userRouter.get('/:id', authentication, checkExists(Users), checkActive(Users), getDetailsUser);
userRouter.delete('/:id', authentication, authorize, checkExists(Users), deleteUser);
module.exports = {
    userRouter
}