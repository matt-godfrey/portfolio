
const dotenv = require("dotenv");
dotenv.config();
let mongo = require('mongodb');
let MongoClient = mongo.MongoClient;
let db;


MongoClient.connect(process.env.MONGO_URI, function(err, client) {
  if(err) throw err;	

  db = client.db('portfolio');

//   db.dropDatabase();
db.dropCollection("users", function(err) {
	if (!err) {
		console.log("users collection dropped");
	}
	else {
		console.log(err)
	}
	client.close();
})
//   console.log(db.collections())
//   client.close();
});