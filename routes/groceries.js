exports.index = function(req, res, next){
	var select = 'SELECT * FROM lists';

	req.app.get('cassandra').cql(select, function(err, groceries){
		if(err){
			next(err);
		}

		res.render('groceries/index', { title: 'Your Groceries', groceries: groceries });
	});
}

exports.add = function(req, res, next){
	var insert = 'INSERT INTO lists (name, price, image, user_email) VALUES (?,?,?,?)',
		params = [req.body.name, parseFloat(req.body.price), req.body.image, 'jjc4fb@virginia.edu'];

	req.app.get('cassandra').cql(insert, params, function(err){
		if(err){
			next(err);
		}

		res.redirect('/groceries');
	});
}

exports.delete = function(req, res, next){
	var remove = 'DELETE FROM lists WHERE user_email=?',
		params = ['jjc4fb@virginia.edu'];

	req.app.get('cassandra').cql(remove, params, function(err, groceries){
		if(err){
			next(err);
		}

		res.redirect('/groceries');
	});
}
