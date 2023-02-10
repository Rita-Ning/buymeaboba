require('dotenv').config();
const { API_VERSION } = process.env;
const express = require('express');
const app = express();
const port = 3000;

const path = require('path');
const http = require('http');
const server = http.createServer(app);
const cors = require('cors');
require('./util/socket-chat').campaign(server);

app.set('trust proxy', true);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));
app.use(express.static('./public'));

// API routes
app.use('/api/' + API_VERSION, [
  require('./server/routes/article_route'),
  require('./server/routes/creator_route'),
  require('./server/routes/explore_creator_route'),
  require('./server/routes/dashboard_route'),
  require('./server/routes/support_route'),
  require('./server/routes/create_post_routes'),
  require('./server/routes/chat_route'),
  require('./server/routes/user_route'),
  require('./server/routes/view_route'),
  require('./server/routes/wallet_route'),
  require('./server/routes/follow_post_route'),
]);

//user route
app.use('/creator/:name', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/creator.html'));
});
app.use('/article/:postid', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/article.html'));
});

// Page not found
app.use(function (req, res, next) {
  res.status(404).sendFile(__dirname + '/public/404.html');
});

// Error handling
app.use(function (err, req, res, next) {
  console.log(err);
  res.status(500).json({ msg: err });
});

server.listen(port, () =>
  console.log(`Example app listening on port ${port}!`)
);
