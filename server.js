const express = require('express');
const path = require("path");
const session = require('express-session');
const pug = require("pug");
const dotenv = require("dotenv");
dotenv.config();
// var cors = require('cors')
MongoDBStore = require("connect-mongo");
const mc = require("mongodb").MongoClient;
let app = express();
let db;
app.locals.db = {};
// const cors = require('cors');
// const corsOptions ={
//     origin:'http://localhost:3000', 
//     credentials:true,            //access-control-allow-credentials:true
//     optionSuccessStatus:200
// }
// app.use(cors(corsOptions));
// app.use(cors());


app.set("views", path.join(__dirname, "views")); // set views folder
app.use(express.static(path.join(__dirname, "/public"))); // serve static files
app.use(express.static((path.join(__dirname, "public", "js"))));
app.use(express.static((path.join(__dirname, "public", "css"))));

app.set("view engine", "pug");

app.use(express.json()); // parse JSON in request
app.use(express.urlencoded({extended: true})); // parses form data

const store = new MongoDBStore({
	// mongoUrl: "mongodb://localhost/portfolio",
	mongoUrl: process.env.MONGO_URI,
	collection: "sessions"
})
store.on("error", (err) => { console.log(err) })
app.set('trust proxy', 1);
app.use(session({
	name: "userSession",
	secret: "A very cool secret",
	// store: store,
	store: store,
	resave: true,
	cookie: {secure: true},
	saveUninitialized: false
}))

app.get("/register", sendRegister);
app.post("/register", checkPasswords, createUser, insertUser);

app.get("/login", sendLogin);
app.post("/login", authenticate);

app.get("/logout", logout);

app.get("/authenticate", validateSession);

function sendRegister(req, res, next) {
    res.render("register");
}

function sendLogin(req, res, next) {
    res.render("login");
}

function checkPasswords(req, res, next) {
	let pass1 = req.body.password.trim();
	let pass2 = req.body.confirmPassword.trim();

	const regex = new RegExp("\s+", "g");

	// if (regex.test(pass1)) {
	// 	res.render("register", {
	// 		error: "Please enter a valid password (no spaces)"
	// 	})
	// 	return;
	// }

	if (!pass1 || !pass2) {
		return;
	}

	if (pass1 !== pass2) {
		res.render("register", {
			error: "Passwords do not match"
		})
		return;
	}
	else {
		next();
	}
	
}

// creates a user if the username doesn't already exist
// logs the user in to their account
function createUser(req, res, next) {
	
	db.collection("users").findOne({username: req.body.username}, function(err, user) {
		if (err) throw err;
		if (!err && user) {
			res.render("register", {
				error: "Username already exists"
			})
		}
		if (!err && !user) {
			let newUser = {
				username: req.body.username,
				password: req.body.password,
				privacy: false
			}
			req.user = newUser;
			req.session.loggedin = true;
			req.session.username = newUser.username;
			req.session.privacy = newUser.privacy;
			next();
		}
	})
	
}

// insert newly registered user into the database
function insertUser(req, res, next) {
	
	db.collection("users").insertOne(req.user, function(err, result) {
		if (err) throw err;
		console.log("User: " + result + " successfully added");

		let id = result.insertedId.toString();
		req.session.userId = id;
		res.redirect("/");
	})
}

// logs in the user if the correct information
// is entered into the form
function authenticate(req, res, next) {

	if (req.session.loggedin) {
		res.render("loginError");
	}
	// console.log(req)
	db.collection("users").findOne({username: req.body.username}, function(err, user) {
		if (err) throw err;
		// log in the user if username found in database and
		// the password they've entered is correct
		if (!err && user) {
			if (user.password === req.body.password) {
				req.session.loggedin = true;
				req.session.userId = user._id;
				req.session.username = user.username;
				res.redirect("/");
			}
			else {
				res.render("login", {
					error: "Incorrect username/password combination"
				})
			}
		}
		if (!err && !user) {
			res.render("login", {
				error: "Username not found in database"
			})
		}
	})
}

// sends session info to the client
function validateSession(req, res) {
	res.set("Content-Type", "application/json");
	res.status(200).send(JSON.stringify(req.session));
}

// terminate the current session when the user wants to
// log out
function logout(req, res, next) {
	if (req.session.loggedin) {
		req.session.destroy()
		res.render("login");
	}
}


//Connect to database

mc.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true, }, function(err, client) {
	if (err) {
		console.log("Error in connecting to database");
		console.log(err);
		return;
	}
	
	//Get the database and save it to a variable
	db = client.db("portfolio");
    app.locals.db = db;
    console.log("Connected to database: portfolio");
	
	//Only start listening now, when we know the database is available
	app.listen(process.env.PORT || 3000);
    console.log("Server listening on port 3000");
})