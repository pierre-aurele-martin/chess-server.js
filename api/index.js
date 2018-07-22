module.exports = router => {
  router.use(function(req, res, next) {
    // do logging
    console.log(req.method + ' ' + req.headers.host + req.baseUrl + req.url);
    next(); // make sure we go to the next routes and don't stop here
  });

  router.get('/', (req, res) => {
    res.json('Welcome to chess game API :)');
  });

  require('./start/start')(router);
  require('./join/join')(router);
  require('./party/party')(router);
};
