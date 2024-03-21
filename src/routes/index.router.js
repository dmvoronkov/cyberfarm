const express = require('express');

const renderTemplate = require('../lib/renderTemplate');
const Home = require('../views/Home');

const router = express.Router();

router.get('/', (req, res) => {
  renderTemplate(Home, {}, res);
});

module.exports = router;
