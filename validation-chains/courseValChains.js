// validation chains for the properties of the Course module
// which will be imported in 'routes.js' and used in the relevant route middlewares

// require the 'check' method from the express-validator library
const { check } = require('express-validator');


/********** CHAINS: **********/

// title
const titleValChain = check('title')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('title required');

// description
const descValChain = check('description')
  .exists({ checkNull: true, checkFalsy: true })
  .withMessage('description required');


// export all of them
module.exports = {
  titleValChain,
  descValChain
};
