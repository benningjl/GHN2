// controllers/passwordController.js
const bcrypt = require('bcryptjs');
const User = require('../models/User'); // Adjust path to your User model

// Function to update user password
const resetPassword = async (req, res) => {
  const { email, newPassword } = req.body; // Assuming newPassword is entered by the user

  try {
    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'User not found' });
    }

    // Generate a salt and hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    // Update the password in the database
    await User.updateOne({ email: user.email }, { password: hashedPassword });

    return res.status(200).json({ msg: 'Password updated successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
};

module.exports = { resetPassword };