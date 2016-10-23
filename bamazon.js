
// need to install the NPM mysql package
var mysql = require('mysql');
var inquirer = require ('inquirer');
var time = new Date().toDateString();

// setting up your connection to the local host
var connection = mysql.createConnection({

    host: 'localhost',
    port: 3306,
    user: 'root',
    password: "",
    database: 'auctiondb'
});

// testing connection, if good start app
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    begin();
});

// Begin app if connection ok with no errors
function begin(){
    
    console.log('\n***** Hello and welcome to "Bamazon" 10.23.GR, today is '+time+' *****\n\nThis text needs to be rewritten\n\nTHrid line of text if needed, rewrite\n');

    inquirer.prompt({

                name : "guess",
                message : "The word you are trying to guess has "+wordLength+" letters.\n\n"+showBlanks+"\n\n\nGUESS A LETTER"

            }).then(function(answer){};

};//end of begin function


