require('@babel/register');
require('dotenv').config();
const session = require('express-session');
const FileStore = require('session-file-store')(session);

const express = require('express');
const morgan = require('morgan');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3004;

const indexRouter = require('./src/routes/index.router');
const apiRouter = require('./src/routes/api.router');

const sessionConfig = {
  name: 'cyberfarm',
  store: new FileStore(),
  secret: process.env.SESSION_SECRET ?? 'Секретное слово',
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 9999999,
    httpOnly: false,
  },
};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(process.cwd(), 'public')));

app.use(session(sessionConfig));

app.use('/api', apiRouter);
app.use('/', indexRouter);

app.listen(PORT, () => console.log(`Сервер запущен: http://localhost:${PORT}`));
