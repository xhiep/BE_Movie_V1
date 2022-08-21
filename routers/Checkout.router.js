const express = require('express');
const { RequirementCheckout } = require('../controllers/Checkout.controller');
const { authentication } = require('../middleware/auth/authentication');
const { authorize } = require('../middleware/auth/authorize');
const checkoutRouter = express.Router();

checkoutRouter.post('/', RequirementCheckout);

module.exports = {
    checkoutRouter
}