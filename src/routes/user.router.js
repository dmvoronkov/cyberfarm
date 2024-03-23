const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, email, password: hash });
    await user.save();
    req.session.login = user.username;
    req.session.save(() => {
      res.json({ status: '201', username: user.username });
    });
  } catch (error) {
    let message;
    if (error.name === 'SequelizeUniqueConstraintError') {
      switch (error.parent.constraint) {
        case 'Users_username_key':
          message = 'Пользователь с таким именем уже существует';
          break;
        case 'Users_email_key':
          message = 'Пользователь с таким email уже существует';
          break;
        default:
          message = 'Поля username и email должны быть уникальны';
      }
    }
    res.json({ status: '422', error: error.parent.constraint, message });
  }
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      res.json({ status: '404', message: 'Пользователь не найден' });
    } else {
      const checkPass = await bcrypt.compare(password, user.password);
      if (!checkPass) {
        res.json({ status: '403', message: 'Неверный пароль' });
      } else {
        req.session.login = user.username;
        req.session.save(() => {
          res.json({ status: '200', message: 'Вы успешно авторизованы', username: user.username });
        });
      }
    }
  } catch (error) {
    res.json({ status: '500', message: 'Ошибка при авторизации' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('cyberfarm');
    res.json({ status: '200' });
  });
});

router.post('/session', (req, res) => {
  if (req.session.login) {
    res.json({ status: '200', message: 'Сессия найдена', username: req.session.login });
  } else {
    res.json({ status: '404', message: 'Сессия не найдена' });
  }
});

module.exports = router;
