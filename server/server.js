//require('./config/config');

const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');

const {User} = require('./models/user');
const {authenticate} = require('./middleware/authenticate');

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());

//registration 
app.post('/registration', async (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  try {
    await user.save();
    console.log("Success");
    const token = await user.generateAuthToken();
    res.header('x-auth', token).send(user);
  } catch(e) {
    console.log("Error");
    res.status(400).send(e);
  }
})

app.get('/user', authenticate, (req, res) => {
  res.send(req.staff);
});

//login 
app.post('/login', async (req, res) => {
  const body = _.pick(req.body, ['email', 'password']);
  try {
    const user = await User.findByCredentials(body.email, body.password)
    if (!user.tokens ) {
      console.log('Empty');
    }
    const token = await user.generateAuthToken()
    res.header('x-auth', token).send(user);
  } catch(e) {
    res.status(400).send();
  };
});

//log out 
app.delete('/logout', authenticate, async (req, res) => {
  try{
    await req.user.removeToken(req.token);
    res.send();
  } catch(e) {
    res.status(400).send();
  }
});


app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = {app};
