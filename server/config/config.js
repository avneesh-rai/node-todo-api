var env = process.env.NODE_ENV || 'development';


if (env === 'test' || env === 'development') {
    var config = require('./config.json');
    var envConfig = config[env];

    Object.keys(envConfig).forEach((key) => {
      process.env[key] = envConfig[key];
    });
}

// if (env === 'test' || env === 'development' || env === 'production') {
//     var config = require('./config.json');
//     var envConfig = config[env];
//
//     Object.keys(envConfig).forEach((key) => {
//       process.env[key] = envConfig[key];
//     });
// }

// Set MONGODB_URI using heroku config:set MONGODB_URI=mongodb://avi:avi123@ds119795.mlab.com:19795/todoapp-avi
// "production": {
//   "MONGODB_URI": "mongodb://avi:avi123@ds119795.mlab.com:19795/todoapp-avi"
// }
