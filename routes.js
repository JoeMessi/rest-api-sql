const express = require('express');
const router = express.Router();
// a simple package for handling exceptions inside of async express routes
// and passing them to your express error handlers
const asyncHandler = require('express-async-handler');


// importing models
const Course = require('./models').Course;
const User = require('./models').User;


// GET request to 'api/users' that returns all users
router.get('/users', asyncHandler( async (req, res) => {
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
router.post('/users', asyncHandler( async (req, res) => {
   const user = await User.create(req.body);
   res.location('/').status(201).end();
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
  res.status(200).json(course);
}));

// POST request to '/api/courses' that creates a new course
router.post('/courses', asyncHandler( async (req, res) => {
  const course = await Course.create(req.body);
    // sets the Location header to the URI for the course
  res.location('/').status(201).end();
}));


// PUT request to '/api/courses/:id' to update a single course
// This is still a working in progress, not sure if it works
router.put('/courses/:id', asyncHandler( async (req, res) => {
  const course = await Course.update(
    {
      title: req.body.title,
      description: req.body.description,
    },
    {
      where: {
        id: req.params.id
      }
    }
  );
  res.status(204).end();
}));


// DELETE request to '/api/courses/:id' to delete a single course
router.delete('/courses/:id', asyncHandler( async (req, res) => {
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
