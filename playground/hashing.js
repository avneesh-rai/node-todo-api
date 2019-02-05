const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc123';

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) =>{
    console.log(hash);
  });
});

var hashPassword = '$2a$10$2m.3Mz7dNkaACtYIQ3m1ceVe47oZadhIuBL0LpeaJtAwRsAl2crL2';

bcrypt.compare('abc', hashPassword, (err, response) => {
  console.log(response);
});

// var data = {
//   id: 10
// };
//
// var token = jwt.sign(data, '123abc');
// console.log(`Token: ${token}`);
//
// var decoded = jwt.verify(token, '123abc');
// console.log('Decoded:', JSON.stringify(decoded));




// var message = 'I am user number 3';
// var hash = SHA256(message).toString();
//
// console.log(`Message: ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
//   id: 4
// };
//
// var token = {
//   data,
//   hash: SHA256(JSON.stringify(data) + 'somesecret').toString()
// };
//
// // token.data.id = 5;
// // token.hash = SHA256(JSON.stringify(data)).toString();
//
// var resultHash = SHA256(JSON.stringify(token.data) + 'somesecret').toString();
//
// if (resultHash === token.hash) {
//   console.log('Data was not changed');
// } else {
//   console.log('Data was changed. Don\'t trust!');
// }
