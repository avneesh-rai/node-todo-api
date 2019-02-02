// const MongoClient = require('mongodb').MongoClient;
const {MongoClient} = require('mongodb'); //Object destructuring
// const {MongoClient, ObjectID} = require('mongodb'); //Object destructuring

// var obj = new ObjectID();
// console.log(obj);

MongoClient.connect('mongodb://localhost:27017/TodoApp', { useNewUrlParser: true }, (error, client) => {
  if(error){
    return console.log('Unable to connect MongoDB server');
  }
  console.log('Connected to MongoDB server');

  const db = client.db('TodoApp');

  // db.collection('Todos').insertOne({
  //   text: 'Something to do',
  //   completed: false
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert todo', error);
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  // });

  // db.collection('Users').insertOne({
  //   name: 'Avneesh',
  //   age: 30,
  //   location: 'India'
  // }, (error, result) => {
  //   if (error) {
  //     return console.log('Unable to insert Users');
  //   }
  //   console.log(JSON.stringify(result.ops, undefined, 2));
  //   console.log(result.ops[0]._id.getTimestamp());
  // });

  client.close();
});
