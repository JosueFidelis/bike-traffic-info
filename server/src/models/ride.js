const mongoose = require('mongoose');

const RideSchema = mongoose.Schema({
    TripId: String,
    TripDuration: Number,
    StartStationId: String,
    StartTime: String,
    StartStationName: String,
    EndStationId: String,
    EndTime: String,
    EndStationName: String,
    BikeId: String
});

const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;