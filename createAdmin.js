const mongoose = require('mongoose');
const User = require('../models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const admin = await User.create({
    name: 'Mahad',
    email: 'mahadmateenbutt@gmail.com',
    phone: '+923180429244',
    password: 'admin@123', // Will be hashed automatically
    role: 'admin',
    isActive: true,
    isVerified: true
  });
  console.log('Admin created:', admin);
  process.exit(0);
});