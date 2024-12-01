const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const User = require('./models/User'); // Adjust the path to your User model

const resetPassword = async (email, newPassword) => {
    try {
        console.log('Connecting to the database...');
        await mongoose.connect('mongodb://localhost:27017/ghn');
        console.log('Database connected');

        // Debugging: Check all users
        console.log('All users:', await User.find({}));

        // Find user with the email (case-insensitive)
        const user = await User.findOne({ email: new RegExp(`^${email}$`, 'i') });
        if (!user) {
            console.log(`No user found with email ${email}.`);
            return;
        }

        console.log('User found:', user);

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        const result = await User.updateOne({ email: user.email }, { password: hashedPassword });
        console.log(
            result.modifiedCount > 0
                ? `Password for ${email} has been reset.`
                : `Password update failed for ${email}.`
        );
    } catch (error) {
        console.error('Error during password reset:', error);
    } finally {
        try {
            console.log('Disconnecting from the database...');
            await mongoose.disconnect();
            console.log('Database disconnected');
        } catch (disconnectError) {
            console.error('Error during database disconnection:', disconnectError);
        }
    }
};

// Replace with the target email and desired new password
resetPassword('jlk@jlk.com', '123456');
