var express = require('express'),
	index = require('./routes/index'),
	users = require('./routes/users'),
	groceries = require('./routes/groceries'),
  http = require('http'),
  path = require('path');

var app = express();

var helenus = require('helenus'),
    pool = new helenus.ConnectionPool({
      hosts      : ['localhost:9160'],
      keyspace   : 'groceries',
      cqlVersion : '3.0.0'
    });

pool.connect(function(err){
  if(err){
    throw(err);
  }

  app.configure(function(){
    app.set('port', process.env.PORT || 3000);
    app.set('cassandra', pool);
    app.set('view engine', 'jade');
    app.set('views', __dirname + '/views');
    app.use(express.logger('dev'));
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(path.join(__dirname, '/public')));
  });

  app.configure('development', function(){
    app.use(express.errorHandler());
  });

  // General
  app.get('/', index.index);
  app.post('/', index.login);

  // Users
  app.get('/users', users.index);
  app.post('/users', users.add);

  // Groceries
  app.get('/groceries', groceries.index);
  app.post('/groceries', groceries.add);
  app.delete('/groceries', groceries.delete);

  http.createServer(app).listen(app.get('port'), function(){
    console.log("Express server listening on port " + app.get('port'));
  });
});