const express = require('express')
const app = express()
const PORT = process.env.PORT || 5000
const getHTML = require('html-get')
const browserless = require('browserless')()

const getContent = async url => {
  // create a browser context inside the main Chromium process
  const browserContext = browserless.createContext()
  const promise = getHTML(url, { getBrowserless: () => browserContext })
  // close browser resources before return the result
  promise.then(() => browserContext).then(browser => browser.destroyContext())
  return promise
}

const metascraper = require('metascraper')([
  require('metascraper-author')(),
  require('metascraper-date')(),
  require('metascraper-description')(),
  require('metascraper-image')(),
  require('metascraper-logo')(),
  require('metascraper-clearbit')(),
  require('metascraper-publisher')(),
  require('metascraper-title')(),
  require('metascraper-url')()
])

app.use(function(req, res, next) {

  if (req.header('X-Pubrio-Key') === xPubrioKey) {
    next();
  } else {
    res.status(403).send({
      status: 403,
      code: '403', 
      message: '403 Forbidden'
    });
  }
  
});

app.get('/', (req, res) => {
  var query = req.params.url;
  const data = getContent(query)
  .then(metascraper)
  .then(metadata => console.log(metadata))
  .then(browserless.close)
  .then(process.exit)
  res.send(data);
})