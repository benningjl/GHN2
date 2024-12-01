const bcrypt = require('bcryptjs');

const testPassword = async () => {
  const plainTextPassword = "123456789"; // Replace with the password you used during login
  const hashedPassword = "$2a$10$YNaZnCKQ3wCoiGSbOEkPr.tQNPIT2oRHJDjUydXd/LZaBTANsg1tG"; // Copy from your database

  const isMatch = await bcrypt.compare(plainTextPassword, hashedPassword);
  console.log(isMatch ? "Password matches" : "Password does not match");
};

testPassword();
