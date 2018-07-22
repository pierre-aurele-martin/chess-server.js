module.exports = router => {
  const start = require('./start.controller');
  router.route('/start').post(start.start);
};
