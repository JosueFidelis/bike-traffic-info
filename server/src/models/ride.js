const mongoose = require('mongoose');

const RideSchema = mongoose.Schema({
    tripId: String,
    tripDuration: Number,
    startStationId: String,
    startTime: String,
    startStationName: String,
    endStationId: String,
    endTime: String,
    endStationName: String,
    bikeId: String
});

const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;