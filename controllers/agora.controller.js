const { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const _ = require('lodash');

const fnGenerateAccessToken = async (req, res, next) => {
    try {
        var query = _.pick(req.query, ['uid', 'channel']);
        const role = RtcRole.PUBLISHER;
        const expirationTimeInSeconds = 24 * 60 * 60;
        const currentTimestamp = Math.floor(Date.now() / 1000);
        const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;
        const token = RtcTokenBuilder.buildTokenWithUid(constants.AGORA_CONFIG.APP_ID, constants.AGORA_CONFIG.APP_CERTIFICATE, query.channel, query.uid, role, privilegeExpiredTs);
        try {
            return res.status(200).json({
                code: 1,
                message: 'new token generated',
                token: token
            })
        } catch (error) {
            return res.status(500).json({
                code: 0,
                message: 'unable to generate token',
                error: error.message
            })
        }
    } catch (err) {
        logger.error(err);
        return next(err);
    }
}

module.exports = {
    fnGenerateAccessToken
}