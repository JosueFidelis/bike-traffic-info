const Ride = require("../models/ride");

let timeNow = null

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
  timeNow = currTime
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

const getStationFlowInLastHour = async (req, res) => {
  //currTime, stationType, stationName
  const stationName = req.query.station
  const hourAgo = new Date(timeNow - 60 * 60 * 1000);

  const endCondition = {
    StartTime: { $gte: hourAgo },
  };
  endCondition['StartStationName'] = stationName;
  const stationDepartures = await Ride.countDocuments(endCondition);
  
  const startCondition = {
    EndTime: { $gte: hourAgo },
  };
  startCondition['EndStationName'] = stationName;
  const stationArrivals = await Ride.countDocuments(startCondition);

  return res.json({arrivals: stationArrivals, departures: stationDepartures});
};

const getMeanDurationBetweenStations = async (req, res) => {
  const startStationName = req.query.startStationName
  const endStationName = req.query.endStationName
  const result = await Ride.aggregate([
    {
      $match: {
        StartStationName: startStationName,
        EndStationName: endStationName,
      }
    },
    {
      $group: {
        _id: null,
        totalDuration: { $sum: '$TripDuration' },
        count: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        meanDuration: { $divide: ['$totalDuration', '$count'] }
      }
    }
  ]).exec();
  
  if (result.length === 0) {
    return res.json({meanTime: -1});
  }

  return res.json({meanTime: result[0].meanDuration});
}

module.exports = {
  getAllRides,
  createRide,
  getTopStationNamesInLastHour,
  getMeanDurationBetweenStations,
  getStationFlowInLastHour
};
