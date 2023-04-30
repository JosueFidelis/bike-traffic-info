const mongoose = require('mongoose');
const config = require('./config');

const connect = async () => {
  try {
    console.log(config.DB_URI);
    await mongoose.connect(config.DB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

module.exports = connect;