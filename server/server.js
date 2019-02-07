require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectId} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');


var app = express();
const port = process.env.PORT;

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

app.delete('/todos/:id', (request, response) => {
  var id = request.params.id;
  if (!ObjectId.isValid(id)) {
    return response.status(404).send();
  }
  Todo.findByIdAndRemove(id).then((todo) => {
    if(!todo){
      return response.status(404).send();
    }
    response.send({todo});
  }).catch((e) => {
    response.status(400).send();
  });
});

app.patch('/todos/:id', (request, response) => {
  var id = request.params.id;
  var body = _.pick(request.body,['text','completed']);
  if(!ObjectId.isValid(id)) {
    return response.status(404).send();
  }
  if (_.isBoolean(body.completed) && body.completed) {
    body.completedAt = new Date().getTime();
  } else {
    body.completed = 'false';
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id,
    {
      $set: body
    }, {
      new: true
    }).then((todo)=>{
      if(!todo){
        response.status(404).send();
      }
    response.send({todo});
  }).catch((e) => {
    response.status(400).send();
  });
});

app.post('/users', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    response.header('x-auth', token).send(user);
  }).catch((err) => {
    response.status(400).send(err);
  });
});

app.get('/users/me', authenticate, (request, response) => {
  response.send(request.user);
});

app.post('/users/login', (request, response) => {
  var body = _.pick(request.body, ['email', 'password']);
  User.findByCredentials(body.email, body.password).then((user) => {
      return user.generateAuthToken().then((token) => {
        response.header('x-auth', token).send(user);
      });
  }).catch((e) => {
    response.status(400).send();
  });
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {
  app
};
