const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');
const {mongooseUsers, mongooseStaff} = require('../db/mongooses');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 1,
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: '{VALUE} is not a valid email'
    }
  },
  password: {
    type: String,
    require: true,
    minlength: 6
  },
  tokens: [{
    access: {
      type: String,
      required: true,
    },
    token: {
      type: String,
      required: true,
    } 
  }]
});

const childcSchema = new mongoose.Schema( {
	name: 'string',
	age: 'number',
});

const parentSchema =  new mongoose.Schema ( {
	profession: 'string',
	persons: [childcSchema],
});	

const Staff = mongooseStaff.model('Staff', parentSchema);

UserSchema.methods.generateAuthToken = async function () {
  const user = this;
  const access = 'auth';
  const text = 'Some text'
  const token = jwt.sign({_id: user._id.toHexString(), text, access}, 'abc123').toString();

  user.tokens = user.tokens.concat([{access, token}]);

  await user.save();
  return token;
  
};

UserSchema.methods.removeToken = function (token) {
  const user = this;

  return user.update({
    $pull: {
      tokens: { token }
    }
  });
};


UserSchema.statics.findByToken = function (token) {
  const User = this;
  let decoded;

  try {
    decoded = jwt.verify(token, 'abc123');
  } catch(e) {
    return Promise.reject();
  }

  const user =  User.findOne({
    '_id': decoded._id,
    'tokens.token': token,
    'tokens.access': 'auth',
  });

  if (user) {
    Staff.find().then(res => console.log(res));
    return Staff.find();
  } else {
    return Promise.reject();
  }
}; 

UserSchema.statics.findByCredentials = function (email, password) {
  const User = this;

  return User.findOne({email}).then((user) => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();  
        }
      });
    });
  })
}

UserSchema.pre('save', function (next) {
  const user = this;

  if (user.isModified('password')) {
    bcrypt.genSalt((err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        user.password = hash;
        next();
      });
    });
  } else {
    next()
  }
})

const User = mongooseUsers.model('User', UserSchema);


module.exports = {User, Staff}
