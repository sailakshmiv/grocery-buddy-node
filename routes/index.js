exports.index = function(req, res){
	res.render('index', { title: 'Login', error_msg: '' });
}

exports.login = function(req, res, next){
	var select = "SELECT * FROM Usernames WHERE email='" + req.body.email + "'";

	req.app.get('cassandra').cql(select, function(err, rows){
		if (rows.length > 0) {
			console.log("here");
			var user_id = rows[0].get('user_id').value;

			var select2 = "SELECT * FROM Users WHERE user_id=" + user_id;

			req.app.get('cassandra').cql(select2, function(err, rows2){
				if (rows2.length > 0) {
					var pass = rows2[0].get('password').value;
					if (pass == req.body.password) {
						console.log("SUCCESS");
						req.app.set('user_id', user_id);
						req.app.set('user_email', req.body.email);
						res.redirect('/groceries');
					}
					else {
						res.render('index', { title: 'Login', error_msg: 'Invalid password.' });
					}
				}
			});
		}
		else {
			res.render('index', { title: 'Login', error_msg: 'Username does not exist!' });
		}
	});
}