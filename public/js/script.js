const dotenv = require("../dotenv");
dotenv.config();
const url = "https://zenquotes.io/api/quotes/";
let quotes = [];
let container = document.getElementById("quote-container");
let nav = document.getElementById("nav-bar");
let currentSession = {};


function init() {
    authenticate();
}



// verifies that the user is logged in
// and stores the session information at the same time
function authenticate() {
	let req = new XMLHttpRequest();
	req.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			currentSession = JSON.parse(req.responseText);
		
			if (currentSession.loggedin) {
				generateHeader();
			}
            
            console.log(currentSession);
		}
	}
	// req.open("GET", `http://localhost:3000/authenticate`);
	req.open("GET", `https://matt-godfrey-portfolio.herokuapp.com/authenticate`);
	req.setRequestHeader("Accept", "application/json");
	req.send();
}


function generateHeader() {
	let header = document.getElementById("nav-bar");
    let login = document.getElementById("login");
    let register = document.getElementById("register");
    if (register != null) {
        register.remove();
    }
    login.setAttribute("href", "../logout");
    login.innerHTML = "Logout";

	let text = document.createElement("p");
	
	text.innerHTML = "Hello, " + currentSession.username + "!";
	text.style.display = "inline";
	header.appendChild(text);
	
}




function randomNum(max) {
    return Math.random() * max;
}

function getQuotes() {
    let req = new XMLHttpRequest();
    // req.withCredentials = true;
    req.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let response = JSON.parse(req.responseText);
            let pos = randomNum(response.length);
            pos = Math.trunc(pos);
           
            let newQuote = document.createElement("p");
            newQuote.innerHTML = response[0].h;
            container.appendChild(newQuote);
        }
    }
    req.open("GET", url, true);
    req.setRequestHeader("Accept", "application/json");
    req.send();
}

getQuotes();