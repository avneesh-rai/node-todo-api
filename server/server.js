const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');


var app = express();

//Configure the middle ware
app.use(bodyParser.json());

app.post('/todos',(request, response) => {
  var newTodo = new Todo({
    text: request.body.text
  });

  newTodo.save().then((doc) => {
    response.send(doc);
  }, (err) => {
    response.status(400).send(err);
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
