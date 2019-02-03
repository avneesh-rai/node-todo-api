const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb');

var {app} = require('./../server');
var {Todo} = require('./../models/todo');

const todos = [{
  _id: new ObjectId(),
  text : 'First test todo'
}, {
  _id: new ObjectId(),
  text: 'Second test todo',
  completed: true,
  completedAt: 333
}];

beforeEach((done) => {
  Todo.deleteMany().then(() => {
      return Todo.insertMany(todos);
  }).then(() => {
    done();
  });
});

describe('Post /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
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
      .expect(200)
      .expect((response) => {
        expect(response.body.todos.length).toBe(2);
      })
      .end(done);
    });
});

describe('Get /todos/:id', () => {
  it('should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end(done);
  });

  it('should return 404 if todo not found', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()}`)
      .expect(404)
      .end(done)
  });

  it('should return 404 for non-Objects ID', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()} + 123`)
      .expect(404)
      .end(done)
  });
});


describe('DELETE /todos/:id', () => {
  it('should remove todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    request(app)
      .delete(`/todos/${hexId}`)
      .expect(200)
      .expect((response) => {
        expect(response.body.todo.text).toBe(todos[0].text);
      })
      .end((err, response) => {
        if(err){
          return done(err);
        }
        Todo.findById(hexId).then((todo) => {
          expect(todo).toBe(null);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should return 404 if todo not found', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()}`)
      .expect(404)
      .end(done)
  });

  it('should return 404 for non-Objects ID', (done) => {
    var newId = new ObjectId();
    request(app)
      .get(`/todos/${newId.toHexString()} + 123`)
      .expect(404)
      .end(done)
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
      .send(body)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.completed).toBe(true);
      })
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
      .send(body)
      .expect((response) => {
        expect(response.body.todo.text).toBe(text);
        expect(response.body.todo.completed).toBe(false);
      })
      .end(done);
  });
});
