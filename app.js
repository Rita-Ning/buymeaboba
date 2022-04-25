const express = require('express');
const app = express();
const port = 3000;

const http = require('http');
const server = http.createServer(app);
// require('ejs');
require('./util/socket-chat').campaign(server);

app.set('trust proxy', true);
// app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

// app.get('/creator/:name', (req, res) => {
//   const { name } = req.params;
//   res.render('creator-prepare', { name });
// });

require('./server/routes')(app);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json(error.message);
  console.log(error);
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
