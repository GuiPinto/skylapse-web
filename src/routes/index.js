var homeController = require('../controllers/home');
var playerController = require('../controllers/player');

module.exports = function (router) {

    router.get('/', homeController.index);

    router.get('/compilation/:uid', homeController.compilation);

    router.get('/list/:uid', homeController.list);

    router.get('/player/:videoId', homeController.player);

};
