const router = require('express').Router();

const agoraRoute = require('./agora');

router.use('/agora', agoraRoute);

module.exports = router;