const express = require('express');

const routes = express.Router();
const RideController = require('./controllers/rideController');

routes.get('/mean', RideController.getMeanDurationBetweenStations);

//routes.get('/station', RideController.index);

module.exports = routes;