var Video = require('../models/video').model;

module.exports.index = function (req, res) {
	var uid = req.params.uid;


	Video.find({ 
		uid: uid
	}).sort({
		date: 1, 
		hour: 1
	}).limit(32)
	.exec(function(err, videos) {

		console.log('found', videos.length, 'videos');

	    res.render('player', {
	    	videos: videos,
	    	videosJson: JSON.stringify(videos),
	    	layout: 'main'
	    });

    });


};
