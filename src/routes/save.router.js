const express = require('express');
const { User, Save } = require('../../db/models');

const router = express.Router();

router.post('/', async (req, res) => {
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

router.post('/init', async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.session.login } });
    const save = await Save.create({ user_id: user.id });
    res.json({ status: '201', message: 'Сохранено', saveId: save.id });
  } catch (error) {
    res.json({ status: '500', message: 'Ошибка при сохранении' });
  }
});

router.get('/all', async (req, res) => {
  if (req.session.login) {
    const user = await User.findOne({ where: { username: req.session.login } });
    const saves = await Save.findAll({ where: { user_id: user.id }, order: [['updatedAt', 'DESC']] });
    res.json(saves);
  } else {
    res.redirect('/');
  }
});

module.exports = router;
