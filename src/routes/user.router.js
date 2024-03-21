const express = require('express');
const bcrypt = require('bcrypt');
const renderTemplate = require('../lib/renderTemplate');
const Reg = require('../views/Reg');
const Menu = require('../views/Menu');
const Login = require('../views/Login');
const { User } = require('../../db/models');

const router = express.Router();

router.get('/register', (req, res) => {
  renderTemplate(Reg, {}, res);
});

router.get('/menu', (req, res) => {
  renderTemplate(Menu, {}, res);
});

router.get('/login', (req, res) => {
  renderTemplate(Login, {}, res);
});

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    await user.save();
    req.session.login = user.username;
    req.session.save(() => {
      res.redirect('/api/user/menu');
      // res.json({ status: '201', id: user.id });
    });
  } catch (err) {
    res.json({ status: '422' });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.json({ err: 'Такой пользователь не найден!' });
    } else {
      // * сравнение паролей, compare возвращает true/false
      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass) {
        res.json({ err: 'Неверный пароль!' });
      } else {
        // * создаём сессию <3
        req.session.login = user.username;
        req.session.save(() => {
          res.redirect('/');
          // res.json({ msg: 'Вы успешно авторизованы!' });
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.json({ err: 'Ошибка при авторизации!' });
  }
});

router.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('CyberfarmCookie');
    res.redirect('/');
  });
});

module.exports = router;
