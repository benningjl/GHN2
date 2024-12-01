const bcrypt = require('bcryptjs');
const hashedPassword = "$2a$10$gNjvQH2ygU7F30zxIFBpVOjR4gPqn8NLsE/wOSuvdpNNZx/6MngKm"; // Password hash from the database
const plainPassword = "password12345"; // The password you want to test

bcrypt.compare(plainPassword, hashedPassword).then(isMatch => {
  console.log('Password match:', isMatch); // Should print `true` if the passwords match
}).catch(err => console.error(err));
