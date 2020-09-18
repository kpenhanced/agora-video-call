const router = require('express').Router();

const agoraController = require('../controllers/agora.controller');

router.get('/token', agoraController.fnGenerateAccessToken);

module.exports = router;