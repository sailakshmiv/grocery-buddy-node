exports.index = function(req, res){
	res.render('index', { title: 'Login', error_msg: '' });
}

exports.login = function(req, res, next){
	var select = 'SELECT * FROM users WHERE email=?',
		params = [req.body.email];

	req.app.get('cassandra').cql(select, params, function(err, users){
		if (err){
			next(err);
		}

		var password = users[0].get('password').value;
		if (req.body.password == password) { 
			res.redirect('/groceries');
		}
		else {
			res.render('index', { title: 'Login', error_msg: 'Invalid password' });
		}
	});
}