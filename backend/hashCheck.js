const bcrypt = require('bcryptjs');

const plainPassword = "password12345";
bcrypt.hash(plainPassword, 10, (err, hashedPassword) => {
  if (err) throw err;
  console.log('Generated hash:', hashedPassword);
});
