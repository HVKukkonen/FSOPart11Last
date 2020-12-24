// environment variables
require('dotenv').config();

let MONGODB_URI = `mongodb+srv://user:${process.env.DbPassword}@santacluster.hpfxd.mongodb.net/wishes?retryWrites=true&w=majority`;
// use dev db for development
if (process.env.NODE_ENV === 'development') {
  MONGODB_URI = `mongodb+srv://user:${process.env.DbPassword}@devdb.dzkke.mongodb.net/devDB?retryWrites=true&w=majority`;
}

console.log('Backend currently uses DB at:', MONGODB_URI);

// let PORT = process.env.PORT
const PORT = process.env.PORT || 3003;
// password is in the .env file which is gitignored

module.exports = {
  MONGODB_URI,
  PORT,
};
