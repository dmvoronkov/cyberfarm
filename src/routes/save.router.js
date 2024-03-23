const express = require('express');
const { User, Save } = require('../../db/models');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    if (req.session.login) {
      const user = await User.findOne({ where: { username: req.session.login } });
      const saves = await Save.findAll({ where: { user_id: user.id }, order: [['updatedAt', 'DESC']] });
      res.json(saves);
    } else {
      res.redirect('/');
    }
  } catch (error) {
    res.json({ status: '404', message: 'Сохраненные игры не найдены' });
  }
});

router.post('/', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.session.login } });
    const save = await Save.create({ user_id: user.id });
    res.json({ status: '201', message: 'Сохранено', saveId: save.id });
  } catch (error) {
    res.json({ status: '500', message: 'Ошибка при сохранении' });
  }
});

router.patch('/', async (req, res) => {
  try {
    const {
      saveId, harvested, required_harvest, energy, tilemap,
    } = req.body;
    const save = await Save.update(
      {
        harvested, required_harvest, energy, tilemap,
      },
      { where: { id: saveId } },
    );
    res.json({ status: '201', message: 'Сохранено' });
  } catch (error) {
    res.json({ status: '500', message: 'Ошибка при сохранении' });
  }
});

router.delete('/', async (req, res) => {
  try {
    const { id } = req.body;
    const save = await Save.destroy({ where: { id } });
    res.json({ status: '200', message: 'Удалено' });
  } catch (error) {
    res.json({ status: '500', message: 'Ошибка при удалении' });
  }
});

module.exports = router;
