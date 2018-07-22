/* 
TODO : 
  JOIN controller is working but not optimize
  No auth system so anyone could play in a party assuming he GET the state (which is possible)
  handle the case of a little pawn mutatio
  
*/
const express = require('express');
const bodyParser = require('body-parser');
const router = express.Router();
const app = express();

//Execute the script for tables creation here
require('./sql/createTables')();

PORT = process.env.PORT;

app.use(bodyParser.urlencoded({ extended: true }));

require('./api/index')(router);
app.use('/api/', router);

app.get('/', (req, res) => {
  res.status(404);
});

app.listen(PORT, () => console.log(`Server is listening on :` + PORT));
