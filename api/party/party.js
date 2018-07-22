module.exports = router => {
  const party = require('./party.controller');
  router.route('/party/:id([0-9]+)').get(party.get);
  router.route('/party/:id([0-9]+)/move').post(party.move);
};
