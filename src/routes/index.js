var indexView = require('../views/index');
var playerController = require('../controllers/player');

module.exports = function (router) {

    router.get('/', indexView);

    router.get('/player', playerController.index);

};
