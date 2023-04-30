const Ride = require("../models/ride");

const getAllRides = async () => {
  const rides = await Ride.find();
  return rides;
};

const createRide = async (msg) => {
  let newRide = JSON.parse(msg);
  delete newRide["UserType"];

  const ride = new Ride(newRide);
  await ride.save().then(console.log(" Saved new Ride: " + newRide["TripId"]));
};

module.exports = {
  getAllRides,
  createRide,
};
