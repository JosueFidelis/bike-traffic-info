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
      $match: { EndTime: { $gte: hourAgo } },
    },
    {
      $group: {
        _id: "$" + stationType,
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
    {
      $limit: 5,
    },
  ]);

  const topStationNames = topStations.map((station) => station._id);
  return topStationNames;
};

const getStationFlowInLastHour = async (currTime, stationType, stationName) => {
  const hourAgo = new Date(currTime - 60 * 60 * 1000);

  const condition = {
    EndTime: { $gte: hourAgo },
  };
  condition[stationType] = stationName;
  const stationArrivals = await Ride.countDocuments(condition);
  console.log(stationName+" "+stationArrivals);
  return stationArrivals;
};

module.exports = {
  getAllRides,
  createRide,
  getTopStationNamesInLastHour,
  getStationFlowInLastHour
};
