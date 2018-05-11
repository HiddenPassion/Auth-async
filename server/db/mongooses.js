var mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const options = {
//   useMongoClient: true
// };
const mongooseUsers = mongoose.createConnection('mongodb://localhost:27017/Server');
const mongooseStaff = mongoose.createConnection('mongodb://localhost:27017/NestedCol');

module.exports = {mongooseUsers, mongooseStaff};
