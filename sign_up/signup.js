var express = require('express');
var router = express.Router();

/* GET signup page */
router.get('/', function(req, res, next) {
  res.render('signup', {
    title: 'Create Account',
    errors: [],
    formData: {}
  });
});

/* POST signup - handle form submission */
router.post('/', function(req, res, next) {
  var { fullName, email, username, password, confirmPassword, terms } = req.body;
  var errors = [];

  // Basic server-side validation
  if (!fullName || fullName.trim().length < 2) {
    errors.push('Full name must be at least 2 characters.');
  }

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!username || username.trim().length < 3) {
    errors.push('Username must be at least 3 characters.');
  }

  if (!password || password.length < 8) {
    errors.push('Password must be at least 8 characters.');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match.');
  }

  if (!terms) {
    errors.push('You must accept the Terms & Conditions.');
  }

  if (errors.length > 0) {
    return res.render('signup', {
      title: 'Create Account',
      errors: errors,
      formData: { fullName, email, username }
    });
  }

  // Success — redirect to success page
  res.redirect('/signup/success');
});

/* GET success page */
router.get('/success', function(req, res, next) {
  res.render('signup-success', { title: 'Account Created!' });
});

module.exports = router;
