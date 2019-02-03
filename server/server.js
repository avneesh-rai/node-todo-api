const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');

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

app.get('/todos', (request, response) => {
  Todo.find().then((todos)=>{
    response.send({todos});
  },(err) => {
    response.status(400).send(err);
  });
});

app.get('/todos/:id', (request, response) => {
  var id = request.params.id;
  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }
  Todo.findById(id).then((todo) => {
    if (!todo) {
      return response.status(404).send();
    }
    response.send({todo});
  }, (err) => {
    response.status(400).send();
  });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});

module.exports = {
  app
};
