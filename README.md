# Grocery Buddy

An app to manage your grocery list! Written using nodejs with an apache cassandra backend. Utilizes express web framework for minimalistic routing.

This app was written for CS 4501 "Cloud Computing" at the University of Virginia, Spring 2013.

## Installation

### From a base Ubuntu system

	sudo apt-get update
	sudo apt-get install g++ curl libssl-dev apache2-utils git-core make
	
### Add the following to /etc/apt/sources.list.d/cassandra.sources.list

	deb http://debian.datastax.com/community stable main

### Then run

	curl -L http://debian.datastax.com/debian/repo_key | sudo apt-key add -
	sudo apt-get update && sudo apt-get install dsc12

### Clone this repo

	git clone git@github.com:jaredculp/grocery-buddy-node.git

### Install node and npm using this script from https://gist.github.com/isaacs/579814

	./install.sh

### Install dependencies for node modules

	cd grocery-buddy/
	npm install

### Start a Cassandra shell

	cqlsh --cql3

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

## Running Grocery-Buddy

### Start a local node server

	node app.js

### Then simply hit this address in your browser

	localhost:3000

## Supported functionalities

* User registration
* User login authentication and logout
* Add grocery items to your list (with images, pulled from URL)
* Delete all grocery items from list
