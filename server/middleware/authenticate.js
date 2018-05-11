const { User } = require('../models/user');


const authenticate = async (req, res, next) => {
  const token = req.header('x-auth');
  try {
    const staff = await User.findByToken(token) ;
    if (!staff) {      
      return Promise.reject();
    }    
    req.staff = staff;
    next();    
  } catch(e) {
    res.status(401).send(e);
    next()
  }
}

module.exports = {
	authenticate
};

