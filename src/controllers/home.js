var Video = require('../models/video').model;
var async = require('async');

module.exports.index = function (req, res) {

	Video.aggregate([
	{ $sort: { date: -1, hour: -1 } },
    { $group: {
        _id: "$uid",
        count: { $sum: 1 }
    }}
	], function (err, uidCounts) {
		if (err) return res.send(err);

		async.map(uidCounts, function(uidCount, cb) {

			Video.findOne({ uid:  uidCount._id })
				.sort({ date: -1, hour: -1 })
				.exec(function(err, vid) {
					if (err) return cb(err);

					uidCount.video = vid;

					return cb(null, uidCount);

				});

		}, function(err, videos) {
			if (err) return res.send(err);

		    res.render('home', {
		    	videos: videos,
		    	layout: 'main'
		    });

		});



	});

};

module.exports.compilation = function (req, res) {
	var uid = req.params.uid;

	Video.find({ 
		uid: uid
	}).sort({
		date: -1, 
		hour: -1
	}).limit(32)
	.exec(function(err, videos) {
		if (err) return res.send(err);

		console.log('found', videos.length, 'videos');

	    res.render('compilation', {
	    	videos: videos,
	    	videosJson: JSON.stringify(videos),
	    	layout: 'main'
	    });

    });


};

module.exports.player = function (req, res) {
	var uid = req.params.uid;
	var videoId = req.params.videoId;

	Video.findById(videoId).exec(function(err, video) {
		if (err) return res.send(err);
		if (!video) return res.send("Video not found.");

	    res.render('player', {
	    	video: video,
	    	videoJson: JSON.stringify(video),
	    	layout: 'main'
	    });

    });


};

module.exports.list = function (req, res) {
	var uid = req.params.uid;
	console.log('uid', uid);
	Video.find({ 
		uid: uid
	}).sort({
		date: -1, 
		hour: -1
	})
	.exec(function(err, videos) {

		console.log('listing', videos.length, 'videos');

	    res.render('list', {
	    	videos: videos,
	    	videosJson: JSON.stringify(videos),
	    	layout: 'main'
	    });

    });


};
