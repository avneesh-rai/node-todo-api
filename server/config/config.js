var env = process.env.NODE_ENV || 'development';

if (env === 'production') {
  process.env.MONGODB_URI = 'mongodb://avi:avi123@ds119795.mlab.com:19795/todoapp-avi'
} else if (env === 'development') {
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if (env === 'test') {
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}
