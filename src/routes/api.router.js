const router = require('express').Router();
const userRouter = require('./user.router');
const saveRouter = require('./save.router');

router.use('/user', userRouter);
router.use('/save', saveRouter);

module.exports = router;
