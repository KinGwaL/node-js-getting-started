const express = require('express')
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 5000
const xPubrioKey = process.env.xPubrioKey;
const cluster = require("cluster");
const totalCPUs = require("os").cpus().length;

if (cluster.isMaster) {
  console.log(`Number of CPUs is ${totalCPUs}`);
  console.log(`Master ${process.pid} is running`);
 
  // Fork workers.
  for (let i = 0; i < totalCPUs; i++) {
    cluster.fork();
  }
 
  cluster.on("exit", (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
    console.log("Let's fork another worker!");
    cluster.fork();
  });
} else {

  const app = express();
  console.log(`Worker ${process.pid} started`);
  
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());

  app.get('/', async (req, res) => {
    var query = req.query.url;

    if (!query || req.header('X-Pubrio-Key') != xPubrioKey) {
      res.status(403).send({
        status: 403,
        code: '403', 
        message: '403 Forbidden'
      });
      return;
    }

    try {
      const options = { url: query, downloadLimit:5000000 };
      const ogs = require('open-graph-scraper');
      const data = await ogs(options);
      res.send(data.result);
    }catch (e) {
      console.log(e);
      res.sendStatus(501);
    }
  });

  app.listen(PORT);

}