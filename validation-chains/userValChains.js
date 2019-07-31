// validation chains for the properties of the User module
// which will be imported in 'routes.js' and used in the relevant route middlewares

// require the 'check' method from the express-validator library
const { check } = require('express-validator');


/********** CHAINS: **********/

// first name
const firstNameValChain = check('firstName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('firstName required');

// last name
const lastNameValChain = check('lastName')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('lastName required');

// email address
const emailValChain = check('emailAddress')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('emailAddress required');

// password
const passwordValChain = check('password')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('password required');


// export all of them
module.exports = {
  firstNameValChain,
  lastNameValChain,
  emailValChain,
  passwordValChain
};
