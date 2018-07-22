module.exports = router => {
  const join = require('./join.controller');
  router.route('/join').put(join.join);
};
