exports.index = function(req, res){
	res.render('users/index', { title: 'New user registration' });
}

exports.add = function(req, res, next){
	var insert = 'INSERT INTO users (email, password) VALUES(?,?);',
		params = [req.body.email, req.body.password];

	req.app.get('cassandra').cql(insert, params, function(err){
		if (err){
			next(err);
		}

		res.redirect('/');
	});
}