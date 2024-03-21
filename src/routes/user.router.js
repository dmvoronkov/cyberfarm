const express = require('express');
const renderTemplate = require('../lib/renderTemplate');
const Reg = require('../views/Reg');
const Menu = require('../views/Menu');
const { User } = require('../../db/models');

const router = express.Router();

router.get('/register', (req, res) => {
  renderTemplate(Reg, {}, res);
});

router.get('/menu', (req, res) => {
  renderTemplate(Menu, {}, res);
});

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const user = await User.create({ username, email, password });
    await user.save();
    res.redirect('/api/user/menu');
    // res.json({ status: '201', id: user.id });
  } catch (err) {
    res.json({ status: '422' });
  }
});

module.exports = router;
