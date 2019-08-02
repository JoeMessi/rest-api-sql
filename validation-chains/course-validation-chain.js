/*

This is a module that contains only validation chains for the Course's properties.
The chains are exported and used in relevant routes in routes.js

*/

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
