/*globals process, __dirname */

var mongoose = require('mongoose'),
	express = require('express'),
	session = require('express-session'),
	bodyParser = require('body-parser'),
	enrouten = require('express-enrouten'),
	hbs = require('express-hbs'),
	hbs_helpers = require('../static/templates/helpers.js')(hbs);

// Initialize app
var app = express();

var port = process.env.PORT || 5000;

// Connect to mongodb
var connect = function () {
	var options = {
		server: { socketOptions: { keepAlive: 1 } },
		database : 'skylapse-cloud'
	};
	
	mongoose.connect(process.env.MONGO || 'mongodb://heroku_app33751165:j7p7j8lgjgbsao41681l6bfaeb@ds041841.mongolab.com:41841/heroku_app33751165', options);
	//mongoose.connect(process.env.MONGO || 'mongodb://localhost/skylapse-cloud', options);
};
connect();
mongoose.connection.on('error', console.log);
mongoose.connection.on('disconnected', connect);

app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

app.engine('hbs', hbs.express3({ layoutsDir: 'src/views/layouts' }));
app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname+'/../static'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(enrouten({ directory: 'routes' }));


app.use(function (req, res, next) {
    res.status(404).render('error');
});

app.listen(port);
console.log('listening on port', port);
