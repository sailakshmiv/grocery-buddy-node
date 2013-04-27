exports.index = function(req, res, next){
	if (req.app.get('user_id') === undefined) {
		res.render('index', {title: 'Login', error_msg: 'Please log in.'});
	}

	var select = "SELECT item_id FROM Userlists WHERE user_id=" + req.app.get('user_id');

	req.app.get('cassandra').cql(select, function(err, rows){
		if(err){
			next(err);
		}

		var items = [];
		if (rows.length > 0) {
			rows.forEach(function(row){
				//all row of result
				row.forEach(function(name,value,ts,ttl){
					//all column of row
					items.push(value);
				});
			});
		}

		var select2 = "SELECT * FROM Groceries WHERE item_id IN(" + items.join() + ")";

		req.app.get('cassandra').cql(select2, function(err, rows2){
			if(err){
				next(err);
			}

			res.render('groceries/index', { 
				title: 'Groceries for ' + req.app.get('user_email'),
				groceries: rows2
			});
		});
	});
}

exports.add = function(req, res, next){
	var uuid = req.app.get('uuid').v1();

	var insert = "INSERT INTO Groceries (item_id, name, price, image, user_id) VALUES("
		+ uuid + ",'" + req.body.name + "','" + req.body.price
		+ "','" + req.body.image + "'," + req.app.get('user_id') + ")";

	req.app.get('cassandra').cql(insert, function(err, rows){
		if(err){
			next(err);
		}

		console.log("Added grocery item[" + uuid + ", " + req.body.name);

		var insert2 = "INSERT INTO Userlists (user_id, item_id) VALUES("
			+ req.app.get('user_id') + "," + uuid + ")";

		req.app.get('cassandra').cql(insert2, function(err, rows){
			if(err){
				next(err);
			}

			console.log("Added grocery item to user " + req.app.get('user_id'));
			res.redirect('/groceries');
		});
	});
}

exports.delete = function(req, res, next){
	var select = "SELECT item_id FROM Userlists WHERE user_id=" + req.app.get('user_id');

	req.app.get('cassandra').cql(select, function(err, rows){
		if(err){
			next(err);
		}

		var items = [];
		if (rows.length > 0) {
			rows.forEach(function(row){
				//all row of result
				row.forEach(function(name,value,ts,ttl){
					//all column of row
					items.push(value);
				});
			});
		}

		var del = "DELETE FROM Userlists WHERE user_id=" + req.app.get('user_id');
		req.app.get('cassandra').cql(del, function(err){
			if(err){
				next(err);
			}

			console.log("Cleared items from user " + req.app.get('user_id'));

			var del2 = "DELETE FROM Groceries WHERE item_id IN(" + items.join() + ")";
			req.app.get('cassandra').cql(del2, function(err){
				if(err){
					next(err);
				}

				console.log("Cleared items from global list");

				res.redirect('/groceries');
			});
		});
	});
}
