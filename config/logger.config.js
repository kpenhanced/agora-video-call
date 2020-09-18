require('dotenv').config();

const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

const logFormat = printf(({ timestamp, label, level, message }) => {
    return `${timestamp} - [${label}] - ${level}: ${message}`;
});

const TRANSPORTS = [];

// when selected for prod it will write to all logs with level `silly` and below to `winston.log`

// npm logging levels prioritized from 0 - 5 (lowest to highest)
// error: 0,
// warn: 1,
// info: 2,
// verbose: 3,
// debug: 4,
// silly: 5

switch (process.env.ENV) {
    case 'prod': TRANSPORTS.push(
        new transports.File({
            level: 'silly',
            filename: 'agora.log',
            maxsize: 4096,
            maxFiles: 4,
            json: true,
            handleExceptions: true,
            colorize: false,
            timestamp: true
        })
    );
        break;
    default: TRANSPORTS.push(
        new transports.Console({
            level: 'silly',
            handleExceptions: true,
            json: true,
            colorize: true,
            timestamp: true
        })
    );
        break;
};

const logger = createLogger({
    transports: TRANSPORTS,
    exitOnError: false,
    format: combine(
        label({ label: 'E-COM' }),
        format.colorize(),
        timestamp({ format: 'DD-MM-YYYY HH:mm:ss' }),
        logFormat
    )
});

module.exports = logger;