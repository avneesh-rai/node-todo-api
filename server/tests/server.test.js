const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((response) => {
        expect(response.body.text).toBe(text);
      })
      .end((err, response) => {
        if (err) {
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((err) => {
          done(err);
        });
      });
  });

  it('should not create todo with invalid body data', (done) => {
    var text = "";
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(400)
      // .expect((response) => {
      //   expect(response.body).toBe(text);
      // })
      .end((err, response) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos)=>{
          expect(todos.length).toBe(2);
          // expect(todos[0].text).toBe(text);
          done();
        }).catch((e)=>{
          done(e);
        });
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(1);
      })
      .end(done);
    });
});

describe('Get /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should not return todo doc created by other user', (done) => {
    request(app)
      .get(`/todos/${todos[1]._id.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-Objects ID', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()} + 123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('DELETE /todos/:id', () => {
  it('should remove todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end((err, response) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBeFalsy();
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not remove todo', (done) => {
    var hexId = todos[1]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end((err, response) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toMatchObject({
            _id: todos[1]._id,
            _creator: todos[1]._creator
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()}`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });

  it('should return 404 for non-Objects ID', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()} + 123`)
      .set('x-auth', users[0].tokens[0].token)
      .expect(404)
      .end(done);
  });
});


describe('PATCH /todos/:id', () => {
  it('should update the todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var text = 'This should be next text';
    var body = {
      completed: true,
      text
    };
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[0].tokens[0].token)
      .send(body)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.completed).toBe(true);
        expect(typeof response.body.todo.completedAt).toBe('number');
      })
      .end(done);
  });

  it('should not update the todo', (done) => {
      var hexId = todos[0]._id.toHexString();
      var text = 'This should be next text';
      var body = {
        completed: true,
        text
      };
      request(app)
        .patch(`/todos/${hexId}`)
        .set('x-auth', users[1].tokens[0].token)
        .send(body)
        .expect(404)
        .end(done);
    });

  it('should clear completedAt when todo is not completed', (done) => {
    var hexId = todos[1]._id.toHexString();
    var text = 'This should be next text';
    var body = {
      completed: false,
      text
    };
    request(app)
      .patch(`/todos/${hexId}`)
      .set('x-auth', users[1].tokens[0].token)
      .send(body)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.completed).toBe(false);
        expect(response.body.todo.completedAt).toBeFalsy();
      })
      .end(done);
  });
});

describe('GET /users/me', () => {
  it('should return user if authenticated', (done) => {
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((response) => {
        expect(response.body._id).toBe(users[0]._id.toHexString());
        expect(response.body.email).toBe(users[0].email);
      })
      .end(done);
  });

  it('should return 401 if not authenticated', (done) => {
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((response) => {
        expect(response.body).toEqual({});
      })
      .end(done);
  });
});

describe('POST /user', () => {
  it('should create a user', (done) => {
    var email = 'example@example.com';
    var password = '123abc!';

    request(app)
      .post('/users')
      .send({email, password})
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeTruthy();
        expect(response.body._id).toBeTruthy();
        expect(response.body.email).toBe(email);
      })
      .end((err) => {
        if (err) {
          return done(err);
        }

        User.findOne({email}).then((user) => {
          expect(user).toBeTruthy();
          expect(user.password).not.toBe(password);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return validation errors if request is invalid', (done) => {
    var email = 'aadsds';
    var password = 'ab12';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });

  it('should not create a user if email in use', (done) => {
    var email = 'abc1@gmail.com';
    var password = 'ab12';
    request(app)
      .post('/users')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('POST /users/login', () => {
  it('should login user and return auth token', (done) => {
    var email = users[1].email;
    var password = users[1].password;
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(200)
      .expect((response) => {
        expect(response.headers['x-auth']).toBeTruthy();
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }
        User.findById(users[1]._id).then((user) => {
          expect(user.tokens[1]).toMatchObject({
            access: 'auth',
            token: res.headers['x-auth']
          });
          done();
        }).catch((e) => done(e));
      });
  });

  it('should reject invalid login', (done) => {
    var email = 'abc12@gmail.com';
    var password = 'ab1123';
    request(app)
      .post('/users/login')
      .send({email, password})
      .expect(400)
      .end(done);
  });
});

describe('DELETE /users/me/token', () => {
  it('should remove auth token on logout', (done) => {
    request(app)
      .delete('/users/me/token')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        User.findById(users[0]._id).then((user)=>{
          expect(user.tokens.length).toBe(0);
          done();
        }).catch((e) => done(e));
      })
  });
});
