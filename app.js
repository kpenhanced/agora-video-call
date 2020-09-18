const hbs = require('hbs');
const path = require('path');
const cors = require('cors');
const express = require('express');

const routes = require('./routes');
const logger = require('./config/logger.config');
const viewsPath = path.join(__dirname, './views');
const partialsPath = path.join(__dirname, './templates');
const constants = require('./config/constants.config');
const publicDirectoryPath = path.join(__dirname, './public');

global.logger = logger;
global.constants = constants;

const app = express();

// for serving static files
app.use(express.static(publicDirectoryPath));

// setup handlebars engine and views location
app.set('view engine', 'hbs');
app.set('views', viewsPath);
hbs.registerPartials(partialsPath);

// CORS controllers
app.use(cors());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Expose-Headers", "Authorization"); // for webgl support
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    next();
});

// routes
app.use(routes)
app.get('/', (req, res) => { res.render('index', { title: 'Agora Web RTC', appId: constants.AGORA_CONFIG.APP_ID }) });

const live = app.listen(constants.PORT, () => {
    const host = live.address().address;
    const port = live.address().port;
    logger.info(`Server is up on https://${host}:${port}`);
});