require('dotenv').config()

const constants = {
    'dev': {
        BASE_URL: process.env.BASE_URL,
        PORT: process.env.PORT,
        AGORA_CONFIG: {
            APP_ID: process.env.APP_ID,
            APP_CERTIFICATE: process.env.APP_CERTIFICATE
        }
    },
    'staging': {

    },
    'prod': {

    }
}

module.exports = constants[process.env.ENV]