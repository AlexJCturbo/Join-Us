const router = require('express').Router();
const { User, Comment, Post } = require('../../models');

//Route to get all users
router.get('/', (req, res) => {
  User.findAll({
    attributes: { exclude: ['password'] }
  })
    .then(dbUserData => res.json(dbUserData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Route to get one user by ID
router.get('/:id', (req, res) => {
  User.findOne({
    attributes: { exclude: ['password'] },
    where: {
      user_id: req.params.id
    },
    include: [
      {
        model: Post,
        attributes: ['post_id', 'title', 'contents', 'date_created']
      },
      {
        model: Comment,
        attributes: ['comment_id', 'content', 'post_id', 'date_created'],
        include: {
          model: Post,
          attributes: ['title']
        }
      },
    ]
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'The user could not be found' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});


//The users route in auth directory also has create user, login and logout routes
//Route to create users
router.post('/', (req, res) => {
  User.create({
    user_name: req.body.user_name,
    email: req.body.email,
    password: req.body.password
  })
    .then(dbUserData => {
      req.session.save(() => {
        req.session.user_id = dbUserData.user_id;
        req.session.user_name = dbUserData.user_name;
        req.session.loggedIn = true;

        res.json(dbUserData);
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Route to login
router.post('/login', (req, res) => {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      user_name: req.body.user_name
    }
  }).then(dbUserData => {
    if (!dbUserData) {
      res.status(400).json({ message: "Sorry, we don't recognize this user name" });
      return;
    }
    const hashedPass = dbUserData.dataValues.password;
    bcrypt.compare(req.body.password, hashedPass, function (err, result) {
      if (err) {
        res
          .status(400)
          .json({ message: "Incorrect email or password. Please try again!" });
        return;
      }

      req.session.save(() => {
        req.session.loggedIn = true;

        res
          .status(200)
          .json({ user: dbUserData, message: "You are now logged in!" });
      });
    });


  });
});

//Route to log out
router.post('/logout', (req, res) => {
  if (req.session.loggedIn) {
    req.session.destroy(() => {
      res.status(204).end();
    });
  }
  else {
    res.status(404).end();
  }
});

//Update user data
router.put('/:id', (req, res) => {
  User.update(req.body, {
    individualHooks: true,
    where: {
      user_id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

//Delete user by id
router.delete('/:id', (req, res) => {
  User.destroy({
    where: {
      user_id: req.params.id
    }
  })
    .then(dbUserData => {
      if (!dbUserData) {
        res.status(404).json({ message: 'No user found with this id' });
        return;
      }
      res.json(dbUserData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;