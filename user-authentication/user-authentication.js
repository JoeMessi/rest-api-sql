/*

This is a module that contains only a function that checks for user authentication.
The authenticateUser func is exported and used in relevant routes in routes.js

*/

const User = require('../models').User; // require User model
const bcryptjs = require('bcryptjs'); // library that hashes passwords
const auth = require('basic-auth'); // library that  parses user's credentials from Authorization Header

// THE FUNCTION...
const authenticateUser = async (req, res, next) => {
  let message = null;
  // Parse the user's credentials from the Authorization Header.
  const credentials = await auth(req);
  // If the user's credentials are available...
  if(credentials) {
    // Attempt to retrieve the user from the data store by their email
    const user = await User.findAll({where: {emailAddress: credentials.name}});
    // If a user was successfully retrieved from the data store...
    if(user.length !== 0) {
      // Use the bcryptjs npm package to compare the user's password
      // (from the Authorization header) to the user's password
      // that was retrieved from the data store.
      const authenticated = await bcryptjs.compareSync(credentials.pass, user[0].password);
      // If the passwords match...
      if(authenticated) {
        // Then store the retrieved user object on the request object
        // so any middleware functions that follow this middleware function
        // will have access to the user's information.
        req.currentUser = user;
      }else{
        message = `Authentication failure for username: ${user.username}`;
      }
    }else{
      message = `User not found for username: ${credentials.name}`;
    }
  }else{
    message = 'Auth header not found';
  }
  // If user authentication failed...
  if(message) {
    console.warn(message);
    // Return a response with a 401 Unauthorized HTTP status code.
    res.status(401).json({ message: 'Access Denied' });

  }else{
    // Or if user authentication succeeded...
    // Call the next() method.
    next();
  }
}

module.exports = authenticateUser;
