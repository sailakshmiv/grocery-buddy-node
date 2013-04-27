exports.index = function(req, res){
	res.render('users/index', { title: 'New user registration' });
}

exports.add = function(req, res, next){
	var uuid = req.app.get('uuid').v1();

	// insert into username table, mapping email to uuid
	var insert = "INSERT INTO Usernames (email, user_id) VALUES('"
		+ req.body.email + "'," + uuid + ")";

	req.app.get('cassandra').cql(insert, function(err, rows){
		if(err){
			next(err);
		}

		console.log("Inserted username[" + uuid + ", " + req.body.email + "]");
	});

	// insert into users table for auth later
	var insert2 = "INSERT INTO Users (user_id, email, password) VALUES("
			+ uuid + ",'" + req.body.email + "','" + req.body.password + "')";

	req.app.get('cassandra').cql(insert2, function(err, rows){
		if(err){
			next(err);
		}

		console.log("Inserted user " + uuid);
		res.redirect('/');
	});
}

exports.logout = function(req, res, next){
	delete req.app.locals.settings.user_id;
	delete req.app.locals.settings.user_email;
	res.redirect('/');
}