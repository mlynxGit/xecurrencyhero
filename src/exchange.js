const puppeteer = require('puppeteer');

const scrapeRate = async (currencyFrom, currencyTo) => {
	const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox", '--window-size=1920,1080'],
      defaultViewport: null
    });
    const page = await browser.newPage();
	await page.setUserAgent('Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0');
	await page.setDefaultNavigationTimeout(0);
	await page.goto('https://www.xe.com/currencyconverter/convert/?Amount=1&From=' + currencyFrom.toUpperCase() + '&To=' + currencyTo.toUpperCase())
	await page.waitForSelector('span.converterresult-toAmount', {timeout : 10000});
	const rate = await page.$eval('span.converterresult-toAmount', span => span.innerText.replace(/(\r\n|\n|\r|\t)/gm, ""));
	const updated_at = await page.evaluate(() => document.querySelectorAll('time[class^="Time-"]')[0].innerText.replace(/(\r\n|\n|\r|\t)/gm, ""));
	var matches = updated_at.match(/(\d{4}-\d{2}-\d{2} \d{2}:\d{2})/);
	var rate_datetime = '';
	if(matches.length) {
		rate_datetime = matches[0];
	}
	console.log("rate is " + rate);
	console.log("updated_at " + rate_datetime);
	await browser.close()
	return [rate, rate_datetime]
}

module.exports.scrapeRate = scrapeRate