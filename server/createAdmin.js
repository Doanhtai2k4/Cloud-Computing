const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' }
});

const User = mongoose.model('User', userSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/mernstack');
    
    const hashedPassword = await bcrypt.hash('admin123', 10);
    
    const admin = await User.findOneAndUpdate(
      { email: 'admin@test.com' },
      { 
        name: 'Admin User',
        email: 'admin@test.com',
        password: hashedPassword,
        role: 'admin'
      },
      { upsert: true, new: true }
    );
    
    console.log('✅ Admin user created successfully!');
    console.log('Email: admin@test.com');
    console.log('Password: admin123');
    console.log('Role:', admin.role);
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
