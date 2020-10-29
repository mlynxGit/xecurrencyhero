const express = require('express')
const bodyParser = require('body-parser');
const scraper = require('./exchange')
const app = express()

var port = process.env.PORT || 8080;
app.use(bodyParser.json());

app.post('/exchange', function(req, res) {
	var rate = '';
	if(req.body.hasOwnProperty('currency1') && req.body.hasOwnProperty('currency2')){
		var currency1 = req.body.currency1;
		var currency2 = req.body.currency2;
		const exchangeRate = new Promise((resolve, reject) => {
	    scraper
	      .scrapeRate(currency1,currency2)
	      .then(data => {
	        resolve(data)
	      }).catch(err => reject('rate scrape failed'))
	  	})
	  	 Promise.all([exchangeRate])
	    .then(data => {
	    	res.json({ sucess: true, rate :  data[0][0], updated_at : data[0][1]})
	    })
	    .catch(err => res.status(500).send(err))
	}
});

app.listen(port);