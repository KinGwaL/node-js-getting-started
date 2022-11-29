const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const xPubrioKey = process.env.xPubrioKey;
const ogs = require('open-graph-scraper');
// const getHTML = require('html-get')
// const browserless = require('browserless')()

// const getContent = async url => {
//   // create a browser context inside the main Chromium process
//   const browserContext = browserless.createContext()
//   const promise = getHTML(url, { getBrowserless: () => browserContext })
//   // close browser resources before return the result
//   promise.then(() => browserContext).then(browser => browser.destroyContext())
//   return promise
// }

// const metascraper = require('metascraper')([
//   require('metascraper-author')(),
//   require('metascraper-date')(),
//   require('metascraper-description')(),
//   require('metascraper-image')(),
//   require('metascraper-logo')(),
//   require('metascraper-clearbit')(),
//   require('metascraper-publisher')(),
//   require('metascraper-title')(),
//   require('metascraper-url')()
// ])

app.get('/', async (req, res) => {
  if (req.header('X-Pubrio-Key') != xPubrioKey) {
    res.status(403).send({
      status: 403,
      code: '403', 
      message: '403 Forbidden'
    });
  }

  var query = req.params.url;
  const options = { url: query };
  try {
    ogs(options)
    .then((data) => {
      console.log(data);
      // const { error, result, response } = data;
      // console.log('error:', error);  // This returns true or false. True if there was an error. The error itself is inside the results object.
      // console.log('result:', result); // This contains all of the Open Graph results
      // console.log('response:', response); // This contains the HTML of page
      res.send("HIHI");
    }).catch(err => {
      console.log(err);
      res.sendStatus(501);
  });
  }catch (e) {
      console.log(e);
      res.sendStatus(e);
  }
  // const data = getContent(query)
  // .then(metascraper)
  // .then(metadata => console.log(metadata))
  // .then(browserless.close)
  // .then(process.exit)
  // res.send(data);
  //res.send(query);
})

app.listen(PORT);