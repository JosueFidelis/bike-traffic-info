const mongoose = require('mongoose');

const RideSchema = mongoose.Schema({
    TripId: String,
    TripDuration: Number,
    StartStationId: String,
    StartTime: Date,
    StartStationName: String,
    EndStationId: String,
    EndTime: Date,
    EndStationName: String,
    BikeId: String
});

const Ride = mongoose.model('Ride', RideSchema);

module.exports = Ride;