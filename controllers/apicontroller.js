var request = require('request');
var googleTrends = require('google-trends-api');
var today = new Date();
var CC_json = require("../CC_parsed.json")
require('dotenv').config()

function FindGeolocation(UserInput) {

	if (CC_json[UserInput]) {

		return CC_json[UserInput]
	} else {
		return { Code1: UserInput, woeid: null };
	}


}

function googleApi(location) {
	return new Promise(resolve => {
		let googleDataList = []
		googleTrends.dailyTrends({
			trendDate: today,
			geo: location,
		},
			function (err, results) {
				if (err) {
					console.log('oh no error!', err);
				} else {
					// The standard way to parse JSON in JavaScript is JSON.parse()
					// The JSON API was introduced with ES5 (2011) and has since been implemented in >99% of browsers by market share, and Node.js. Its usage is simple:
					// const json = '{ "fruit": "pineapple", "fingers": 10 }';
					// const obj = JSON.parse(json);
					// console.log(obj.fruit, obj.fingers);
					try {
						var obj = JSON.parse(results);
						obj.default.trendingSearchesDays[0].trendingSearches.forEach(element => {
							googleDataList.push({ title: element.title.query, hits: element.formattedTraffic, url: element.shareUrl, pic: element.image.imageUrl, related: element.relatedQueries })
						});
						resolve(googleDataList)
					} catch (error) {
						console.log('Parsing the Json wasnt correct ')
						resolve(googleDataList)
					}

				}
			}
		)
	})
}

function twitterApi(location) {

	return new Promise(resolve => {
		let twitterDataList = []
		request.get('https://api.twitter.com/1.1/trends/place.json?id=' + location, {
			'auth': {
				'user': null,
				'pass': null,
				'bearer': process.env.Twitter_bearer,
				'sendImmediately': true

			}
		},
			function (error, response, body) {
				if (!error && response.statusCode == 200) {
					var jsonObj = JSON.parse(body);
					jsonObj[0].trends.forEach(element => {
						if (element.tweet_volume != null) {
							twitterDataList.push({ title: element.name, hits: element.tweet_volume, url: element.url })
						}
					})
					//console.log(googleDataList)
					resolve(twitterDataList)
				} else {
					console.error('error:', error); // Print the error if one occurred
					resolve(twitterDataList)
				}
			}
		)
	})

}

exports.index = async function (req, res, next) {

	res.render('index', { message: req.flash('message'), title: "TRENDR" });

}
exports.defaultCountries = async function (req, res, next) {

	const googleProm = googleApi("US");
	let googleResult = await googleProm;
	res.send({ countries: googleResult, activeCountry: "US" });

}


exports.searchCountries = async function (req, res, next) {
	let Country_obj = FindGeolocation(req.body.country);
	const googleProm = googleApi(Country_obj.Code1);
	let googleResult = await googleProm;
	res.send({ countries: googleResult, activeCountry: Country_obj.Code1 });
}

exports.defaultTwitter = async function (req, res, next) {
	const twitProm = twitterApi('23424977');
	let twitResult = await twitProm;
	res.send({ twitterData: twitResult, activeCountry: "US" });

}

exports.searchTwitter = async function (req, res, next) {
	let Country_obj = FindGeolocation(req.body.country);
	const twitProm = twitterApi(Country_obj.woeid);
	let twitResult = await twitProm;
	res.send({ twitterData: twitResult, activeCountry: Country_obj.Code1 })
}