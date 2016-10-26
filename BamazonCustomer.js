
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
    database: 'bamazon'
});


// testing connection, if good start app
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId);
    init();

})//end of conection.connect

var init = function(){
    console.log('\n***** Hello and welcome to "Bamazon" 10.23.GR, today is '+time+' *****\n');

        connection.query('SELECT ItemID, ProductName, Price FROM products', function(err, res){
            if (err) throw err;
            res.forEach(function(item,index){
                console.log(item.ProductName+", "+"$"+item.Price+",  ID=("+item.ItemID+")\n");
                });
                begin();
        });


}//endo of init function


// Begin app if connection ok with no errors
var begin = function (){
    
    inquirer.prompt([{

                type : 'input',
                name : "id",
                message : "Enter the ID=(number) for the item you would like to purchase."

                },
                {
                name : "quanity",
                message : "Excellent choice! How many would you like to buy?"
                
            }]).then(function(answer){
                    //console.log(answer.id)
                    var id = answer.id;
                    var quanity = answer.quanity
                    // console.log(quanity)
                    var query = 'SELECT StockQuantity FROM products WHERE?' 
                    connection.query(query,{itemID : id}, function(err, res){
                        if (err) throw err;
                        // console.log(res[0].StockQuantity)
                        var quanityNum = parseInt(res[0].StockQuantity);
                        // console.log("quantityNum = "+quanityNum)
                                if (quanity <= quanityNum){
                                    buy(id, quanityNum, quanity);
                                }else{
                                    console.log ("\n********** OH NO! ***********\nSorry, but our inventory appears to be low on this item. We can not fullfill your request.\n Please select fewer items for your order or another item")
                                    init();
                                };
                            });
                    // });//end of answer2 promise
            });//end of answer promise

};//end of begin function

function buy (id, quanityNum, quanity){
    // console.log("this is hte BUY function")
    // console.log("this is quanity "+quanity)
    // console.log("this is quanityNum "+quanityNum)
    quanityNum -= quanity
    // console.log("new quanityNum ="+quanityNum)
    var query = 'UPDATE products SET ? WHERE ?'
    connection.query(query,[{StockQuantity : quanityNum},{itemID:id}], function(err,res){
        if (err)throw err;
        console.log("=========================")
        console.log("ORDER PLACED SUCESSFULLY!")
        console.log("=========================")
    });
    var select = 'SELECT Price FROM products WHERE ?'
    connection.query(select,{itemID : id}, function(err, res){
        if (err) throw err;
        var priceEach = res[0].Price;
        var totalPrice = priceEach * quanity
        console.log("Your order total is "+totalPrice);
        return;
        });

//remove items from the database Stock Quantity based on user choice, message order complete. 


return;
};//end of buy function


