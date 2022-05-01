const express = require('express');
const app = express();
const port = 3000;

const http = require('http');
const server = http.createServer(app);
require('./util/socket-chat').campaign(server);

app.set('trust proxy', true);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

require('./server/routes')(app);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json(error.message);
  console.log(error);
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
