const mongoose = require('mongoose');

const url = 'mongodb://localhost:27017/TodoApp';
const mlabURL = 'mongodb://avi:avi123@ds119795.mlab.com:19795/todoapp-avi';

mongoose.Promise = global.Promise;
// mongoose.connect(url, {useNewUrlParser: true});
// Uncomment it while uploading to heroku
mongoose.connect(mlabURL || url, {useNewUrlParser: true});

module.exports = {
  mongoose
};
