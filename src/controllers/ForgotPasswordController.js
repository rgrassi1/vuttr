const User = require('../models/User');
const Token = require('../models/Token');
const crypto = require('crypto');
const isAfter = require('date-fns/isAfter');
const subDays = require('date-fns/subDays');
const Queue = require('../lib/Queue');

module.exports = {
  store: async (req, res) => {
    const { email, redirect } = req.value.body
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const token = await Token.create({
      token: crypto.randomBytes(32).toString('hex'),
      type: 'forgot',
      user: user._id
    })
    user.tokens.push(token);
    await user.save();
  
    await Queue.add('ForgotPassword', { user, redirect });

    return res.status(204).send();
  },

  update: async (req, res) => {  
    const { token } = req.params;
    const userToken = await Token.findOne({ token });    
    if (!userToken) {
      return res.status(400).json({ message: 'Token not valid' });
    }
  
    const expired = isAfter(
      subDays(new Date(), 2),
      userToken.createdAt
    );
    if (expired) {
      return res.status(401).json({ message: 'Recovery token is expired' });
    }
  
    const user = await User.findById(userToken.user);

    const { password } = req.value.body;
    user.password = password;      
    await user.save();
  
    return res.status(204).send();
  }
}