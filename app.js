require('@babel/register');
require('dotenv').config();

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.cwd(), 'public')));

const indexRouter = require('./src/routes/index.router');
const apiRouter = require('./src/routes/api.router');

app.use('/', indexRouter);
app.use('/api', apiRouter);

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
