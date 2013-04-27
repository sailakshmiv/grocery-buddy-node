# Grocery Buddy

An app to manage your grocery list! Written using nodejs with an apache cassandra backend. Utilizes express web framework for minimalistic routing.

## Installation

### Clone this repo

	git clone git@github.com:jaredculp/grocery-buddy-node.git

Make sure you have nodejs and npm (comes with nodejs) installed.

### Install dependencies, make sure you run as root

	cd grocery-buddy/
	npm install

### Start a Cassandra shell

	cassandra-cli

### Create the keyspace

	CREATE KEYSPACE GroceryBuddy 
	WITH REPLICATION = {
		'class' : 'SimpleStrategy',
		'replication_factor' : 3
	};

### Switch to the new keyspace

	USE GroceryBuddy;

### Create all the column families (tables) we need

	CREATE TABLE users (user_id uuid, email text, password text, PRIMARY KEY (user_id));
	CREATE TABLE usernames (email text, user_id uuid, PRIMARY KEY (email));
	CREATE TABLE groceries (item_id uuid, name text, price text, image text, user_id uuid, PRIMARY KEY (item_id));
	CREATE TABLE userlists (user_id uuid, item_id uuid, PRIMARY KEY (user_id, item_id));

## Supported functionalities

* User registration
* User login authentication and logout
* Add grocery items to your list (with images, pulled from URL)
* Delete all grocery items from list