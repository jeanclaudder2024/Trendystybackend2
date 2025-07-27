const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./Models/User");
require('dotenv').config();

const createAdminUser = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/trendysty');
    console.log('Connected to MongoDB');

    // Check if admin user already exists
    const existingAdmin = await User.findOne({ email: 'admin@trendysty.com' });
    if (existingAdmin) {
      console.log('Admin user already exists!');
      console.log('Email: admin@trendysty.com');
      console.log('Password: admin123');
      process.exit(0);
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 10);

    // Create admin user
    const adminUser = new User({
      username: 'admin',
      email: 'admin@trendysty.com',
      password: hashedPassword
    });

    await adminUser.save();
    console.log('Admin user created successfully!');
    console.log('Email: admin@trendysty.com');
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin user:', error);
    process.exit(1);
  }
};

createAdminUser();