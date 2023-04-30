require('dotenv').config();

const user = process.env.USERDB;
const password = process.env.PASSWORD;

module.exports = {
  DB_URI: `mongodb+srv://${user}:${password}@ridetogether.epq6eub.mongodb.net/?retryWrites=true&w=majority`,
};