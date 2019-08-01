 // require express
const express = require('express');
// starting an express router
const router = express.Router();
// importing models
const Course = require('./models').Course;
const User = require('./models').User;
// package/helper func that wraps a callback into a try/catch block
// used on every route, we avoid writing try/catch for every single route
const asyncHandler = require('express-async-handler');
// require validationResult from the express-validator library
const { validationResult } = require('express-validator');
// library that hashes passwords
const bcryptjs = require('bcryptjs');
// require the user authentication func
const authenticateUser = require('./user-authentication/authenticateUser');

// importing validation chains for the User module
const {
  firstNameValChain,
  lastNameValChain,
  emailValChain,
  passwordValChain
} = require('./validation-chains/userValChains');

// importing validation chains for the Course module
const {
  titleValChain,
  descValChain
} = require('./validation-chains/courseValChains');


// GET request to 'api/users' that returns all users
router.get('/users', authenticateUser, asyncHandler( async (req, res) => {

  const users = await User.findAll({
    include: [
      {
        model: Course,
        as: 'student',
      },
    ]
  });
  res.status(200).json(users);
}));


// POST request to 'api/users' that creates a new user
router.post('/users', [

  firstNameValChain,
  lastNameValChain,
  emailValChain,
  passwordValChain

], asyncHandler( async (req, res) => {
  // attempt to get the validation result from the Request object.
  const errors = validationResult(req);
  // If there are validation errors...
  if(!errors.isEmpty()) {
    // use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);
    // return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });

  }else{
    // hasing password before creating new user
    req.body.password = await bcryptjs.hashSync(req.body.password);
    const user = await User.create(req.body);
    res.location('/').status(201).end();
  }

}));


// GET request to '/api/courses' that returns a list of courses including the user that owns each course
router.get('/courses', asyncHandler( async (req, res) => {
  const courses = await Course.findAll({
    include: [
      {
        model: User,
        as: 'student',
      }
    ]
  });
  res.status(200).json(courses);
}));


// GET request to '/api/courses/:id' that returns a single course, including the user that owns the course
router.get('/courses/:id', asyncHandler( async (req, res) => {
  const course = await Course.findAll({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: User,
        as: 'student',
      }
    ]
  });
  // if/else on if a course is found (which means :id doesn't exists)
  if(course.length !== 0) {
    res.status(200).json(course);
  }else{
    res.status(404).json({message: "Course not found!"});
  }

}));

// POST request to '/api/courses' that creates a new course
router.post('/courses',
  authenticateUser,
  [ titleValChain, descValChain ],

  asyncHandler( async (req, res) => {

  // attempt to get the validation result from the Request object.
  const errors = validationResult(req);
  // If there are validation errors...
  if(!errors.isEmpty()) {
    // use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);
    // return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });
  }else{
    const course = await Course.create(req.body);
      // sets the Location header to the URI for the course
    res.location('/').status(201).end();
  }

}));


// PUT request to '/api/courses/:id' to update a single course
router.put('/courses/:id',
 authenticateUser,
 [ titleValChain, descValChain ],

 asyncHandler( async (req, res) => {
  // code to get and return the current user...
  const currentUser = req.currentUser;
  // attempt to get the validation result from the Request object.
  const errors = validationResult(req);
  // If there are validation errors...
  if(!errors.isEmpty()) {
    // use the Array `map()` method to get a list of error messages.
    const errorMessages = errors.array().map(error => error.msg);
    // return the validation errors to the client.
    res.status(400).json({ errors: errorMessages });

  }else{

   // check if user owns that course
   console.log(currentUser[0].dataValues.id);
   const userLoggedIn = await User.findByPk(currentUser[0].dataValues.id);
   console.log(userLoggedIn.student);

    // get course by it's :id
    const course = await Course.findByPk(req.params.id);

    if(course) {
      course.title = req.body.title;
      course.description = req.body.description;
      await course.save();
      res.status(204).end();
    }else{
      res.status(404).json({message: "Course not found!"});
    }
  }
}));


// DELETE request to '/api/courses/:id' to delete a single course
router.delete('/courses/:id', authenticateUser, asyncHandler( async (req, res) => {
  // throw new Error('noooooo')
  const course = await Course.destroy({
    where: {
      id: req.params.id
    }
  })
  res.status(204).end();
}));

// DELETE request to '/api/users/:id' to delete a single user
router.delete('/users/:id', asyncHandler( async (req, res) => {
  const user = await User.destroy({
    where: {
      id: req.params.id
    }
  })
  res.status(204).end();
}));




module.exports = router;
