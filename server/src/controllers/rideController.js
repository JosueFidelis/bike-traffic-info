const Ride = require("../models/ride");

const getAllRides = async () => {
  const rides = await Ride.find();
  return rides;
};

const createRide = async (newRide) => {
  delete newRide["UserType"];

  const ride = new Ride(newRide);
  await ride.save().then(console.log(" Saved new Ride: " + newRide["TripId"]));
};

const getTopStationNamesInLastHour = async (currTime, stationType) => {
  const hourAgo = new Date(currTime - 60 * 60 * 1000);
  const topStations = await Ride.aggregate([
    {
      $group: {
        _id: '$stationType',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { count: -1 } // Sort by count in descending order
    },
    {
      $limit: 5 // Limit to top 5 stations
    }
  ]);
  console.log(topStations);
  return topStations;
}

module.exports = {
  getAllRides,
  createRide,
  getTopStationNamesInLastHour
};
