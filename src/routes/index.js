var homeController = require('../controllers/home');
var playerController = require('../controllers/player');

module.exports = function (router) {

    router.get('/', homeController.index);

    router.get('/player/:uid', playerController.index);

};
