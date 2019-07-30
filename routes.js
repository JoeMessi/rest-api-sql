const express = require('express');
const router = express.Router();

// importing models
const Course = require('./models').Course;
const User = require('./models').User;


// GET request to 'api/users' that returns all users
router.get('/users', (req, res) => {

  User.findAll({
    include: [
      {
        model: Course,
        as: 'student',
      },
    ]
  })
   .then(data => res.status(200).json(data))
});

// POST request to 'api/users' that creates a new user
router.post('/users', (req, res) => {
   User.create(req.body)
     .then(res.location('/').status(201).end());
});


// GET request to '/api/courses' that returns a list of courses including the user that owns each course
router.get('/courses', (req, res) => {
  Course.findAll({
    include: [
      {
        model: User,
        as: 'student',
      }
    ]
  })
  .then(data => res.status(200).json(data))
});


// GET request to '/api/courses/:id' that returns a single course, including the user that owns the course
router.get('/courses/:id', (req, res) => {
  Course.findAll({
    where: {
      id: req.params.id
    },
    include: [
      {
        model: User,
        as: 'student',
      }
    ]
  })
   .then(data => res.status(200).json(data))
});

// POST request to '/api/courses/:id' that creates a new course
router.post('/courses', (req, res) => {
  Course.create(req.body)
    // sets the Location header to the URI for the course
    .then(res.location('/').status(201).end());
});


// PUT request to '/api/courses/:id' to update a single course
// This is still a working in progress, not sure if it works
router.put('/courses/:id', (req, res) => {
  Course.update({
    where: {
      id: req.params.id
    }
  },
  {
    title: req.body.title,
    description: req.body.description,
  }
)
  .then(res.status(204).end());
});


// DELETE request to '/api/courses/:id' to delete a single course
router.delete('/courses/:id', (req, res) => {
  Course.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(res.status(204).end());
});
// DELETE request to '/api/users/:id' to delete a single user
router.delete('/users/:id', (req, res) => {
  User.destroy({
    where: {
      id: req.params.id
    }
  })
  .then(res.status(204).end());
});




module.exports = router;
