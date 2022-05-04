const exphbs  = require('express-handlebars');

const dotenv = require('dotenv');
const express = require('express');
const http = require('http');
const path = require('path');

dotenv.load();

const app = express();

app.set('views', __dirname + '/views');
app.engine('.hbs', exphbs({
    defaultLayout: 'main',
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: [__dirname + '/views/partials', __dirname + '/views/reports'],
    helpers: {
        equal: function (first, second, options) {
            if(first !== second) {
                return options.inverse(this);
            } else {
                return options.fn(this);
            }
        }
    }
}));
app.set('view engine', '.hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());



const port = 3000;
const config = {baseURL : `http://localhost:${port}`};

app.get('/', function (req, res, next) {
  const isDev = process.env.NODE_ENV || 'dev';
  const scriptsPath = isDev ? `http://localhost:3001` : '/dist';
  res.render('index', {scriptsPath});
});

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

http.createServer(app)
  .listen(port, () => {
    console.log(`Listening on ${config.baseURL}`);
  });
