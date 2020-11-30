// environment variables
require('dotenv').config();

// let PORT = process.env.PORT
const PORT = process.env.PORT || 3003;

const DbName = 'wishes';
// password is in the .env file which is gitignored

const MONGODB_URI =
    'mongodb+srv://user:'+process.env.DbPassword+'@santacluster.hpfxd.mongodb.net/'+DbName+'?retryWrites=true&w=majority';

module.exports = {
  MONGODB_URI,
  PORT,
};
