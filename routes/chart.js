var express = require('express');
var router = express.Router();

var googleTrends = require('google-trends-api');

var searchTerm = 'League of Legends';

// Date(Date.now() - (4 * 60 * 60 * 1000))
// var endDate = new Date(Date.now());
// var startDate = new Date(Date.now() - (4 * 60 * 60 * 1000));
var graphData = {}

function renderWrapper() {
    var endDate = new Date(Date.now());
    var startDate = new Date(Date.now() - (4 * 60 * 60 * 1000));

    googleTrends.interestOverTime({
		keyword: searchTerm,
		startTime: startDate,
		endTime: endDate,
		granularTimeResolution: true,
	}, function (err, results) {
		if (err) {
			console.log('oh no error!', err);
		}
		else {
			var obj = JSON.parse(results);
			//console.log(obj.default.timelineData);
			var timelineData = obj.default.timelineData;
			var value_list = [];
			var time_list = [];
			timelineData.forEach((item) => {
				time_list.push(item.formattedTime);
				value_list.push(item.value[0]);
            })
            graphData = {
                type: 'line',
                data: {
                    labels: time_list,
                    datasets: [{
                        label: 'Interest over time',
                        data:value_list,
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                }
		}
	});
}
renderWrapper()

router.get('/', function(req, res) {
    res.render('chart', { message: req.flash('message'), title: "TRENDR" , data:JSON.stringify(graphData)});
});
module.exports = router