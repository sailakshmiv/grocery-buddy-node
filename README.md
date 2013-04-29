# Grocery Buddy

An app to manage your grocery list! Written using nodejs with an apache cassandra backend. Utilizes express web framework for minimalistic routing.

This app was written for CS 4501 "Cloud Computing" at the University of Virginia, Spring 2013.

## Installation

### Installing Node.js

Grocery Buddy is built on Node.js. To install Node.js on a base Ubuntu system, run:

	sudo apt-get install python-software-properties python g++ make
	sudo add-apt-repository ppa:chris-lea/node.js
	sudo apt-get update
	sudo apt-get install nodejs

### Setting Up Cassandra

Grocery Buddy uses Cassandra as its datastore. To run it, you must have a running Cassandra system.
The following instructions will guide you through setting up Cassandra. For development, you can install a single-node Cassandra system on your local machine.
For production, you should dedicate several servers to running a Cassandra cluster.

#### Development (Single-Node on localhost)

The following instructions will set up a single Linux machine with a single-node Cassandra system and a node.js server.

##### From a base Ubuntu system

	sudo apt-get update
	sudo apt-get install g++ curl libssl-dev apache2-utils git-core make

##### Add the following to /etc/apt/sources.list.d/cassandra.sources.list

	deb http://debian.datastax.com/community stable main

##### Then run

	curl -L http://debian.datastax.com/debian/repo_key | sudo apt-key add -
	sudo apt-get update
    sudo apt-get install dsc12

#### Production (multi-node Cluster with OpsCenter)

Follow the instructions on the CS 4501 course wiki to install and configure a multi-node Cassandra cluster.
Make note of the public DNS addresses of each of the nodes: you will need this later.

### Setting up Grocery Buddy

To run the app, clone a current copy of the git repository:

	git clone git@github.com:jaredculp/grocery-buddy-node.git

Then, use npm to install all dependencies.

	cd grocery-buddy/
	npm install

Finally, change the value of the "hosts" variable on line 12 of app.js
The line should look something like this:

    hosts      : ['ec2-75-101-203-249.compute-1.amazonaws.com:9160',
                    'ec2-23-20-99-179.compute-1.amazonaws.com:9160',
                    'ec2-23-20-171-54.compute-1.amazonaws.com:9160'],

If you are running Cassandra on your local machine, you should change this to be:

    hosts      : ['localhost:9160'],

Otherwise, you should change the domain names to match those of the nodes in your cluster.

### Setting up the Cassandra keyspace

Start up an instance of the CQL shell using the following command:

	cqlsh --cql3 localhost 9160

For a Cassandra cluster, replace "localhost" with the domain name of one of your nodes.

Then, create the keyspace using:

	CREATE KEYSPACE GroceryBuddy
	WITH REPLICATION = {
		'class' : 'SimpleStrategy',
		'replication_factor' : 3
	};

Switch to the new keyspace

	USE GroceryBuddy;

Create all the column families (tables) we need

	CREATE TABLE users (user_id uuid, email text, password text, PRIMARY KEY (user_id));
	CREATE TABLE usernames (email text, user_id uuid, PRIMARY KEY (email));
	CREATE TABLE groceries (item_id uuid, name text, price text, image text, user_id uuid, PRIMARY KEY (item_id));
	CREATE TABLE userlists (user_id uuid, item_id uuid, PRIMARY KEY (user_id, item_id));

## Running Grocery-Buddy

### Start a node.js server

cd into the directory grocery-buddy/ directory and run:

	node app.js

### Then simply hit this address in your browser

	localhost:3000

To access the site from another machine, simply replace "localhost" with that machine's domain name.

## Supported functionalities

* User registration
* User login authentication and logout
* Add grocery items to your list (with images, pulled from URL)
* Delete all grocery items from list
