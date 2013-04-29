var express = require('express'),
index = require('./routes/index'),
users = require('./routes/users'),
groceries = require('./routes/groceries'),
http = require('http'),
path = require('path');

var app = express();

var helenus = require('helenus'),
pool = new helenus.ConnectionPool({
    hosts      : ['ec2-75-101-203-249.compute-1.amazonaws.com:9160',
                  'ec2-23-20-99-179.compute-1.amazonaws.com:9160'
                  'ec2-23-20-171-54.compute-1.amazonaws.com:9160'],
    keyspace   : 'grocerybuddy',
    cqlVersion : '3.0.0'
}),
uuid = require('node-uuid');

pool.connect(function(err, keyspace){
    if(err){
        throw(err);
    }

    app.configure(function(){
        app.set('port', process.env.PORT || 3000);
        app.set('cassandra', pool);
        app.set('uuid', uuid);
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
    app.get('/logout', users.logout);

    // Groceries
    app.get('/groceries', groceries.index);
    app.post('/groceries', groceries.add);
    app.delete('/groceries', groceries.delete);

    http.createServer(app).listen(app.get('port'), function(){
        console.log("Express server listening on port " + app.get('port'));
    });
});
