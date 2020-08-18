var express = require('express');
var router = express.Router();
var cache = require('memory-cache');

// configure cache middleware
let memCache = new cache.Cache();
var apiController = require('../controllers/apicontroller')


let cacheMiddleware = (duration) => {
	return (req, res, next) => {
		let key = '__express__' + req.originalUrl || req.url
		let cacheContent = memCache.get(key);
		if (cacheContent) {
			res.send(cacheContent);
			return
		} else {
			res.sendResponse = res.send
			res.send = (body) => {
				memCache.put(key, body, duration * 1000);
				res.sendResponse(body)
			}
			next()
		}
	}
}

router.get('/', cacheMiddleware(30), apiController.index);
router.get('/defaultCountries', apiController.defaultCountries);
router.get('/defaultTwitter', apiController.defaultTwitter);

router.post('/searchCountries', apiController.searchCountries);

router.post('/searchTwitter', apiController.searchTwitter);



module.exports = router
