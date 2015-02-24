var Video = require('../models/video').model;

module.exports.index = function (req, res) {

	Video.aggregate([
	{ $sort: { date: -1, hour: -1 } },
    { $group: {
        _id: "$uid",
        count: { $sum: 1 }
    }}
	], function (err, videos) {
	    res.render('home', {
	    	videos: videos,
	    	layout: 'main'
	    });

	});

};
