
var mysql = require('mysql');
var inquirer = require ('inquirer');
var time = new Date().toDateString();

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
    console.log('\n***** Hello and welcome to "Bamazon for Managers" 10.23.GR, today is '+time+' *****\n');

    begin();

}//endo of init function


// Begin app if connection ok with no errors
var begin = function (){
    
    inquirer.prompt({

                type : 'list',
                name : "task",
                message : "Hello Manager, what would you like to do today?",
                choices : ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
                
            }).then(function(answer){
                switch (answer.task){
                    case "View Products for Sale" : forSale();
                    break;

                    case "View Low Inventory" : lowInventory();
                    break;

                    case "Add to Inventory" : addInventory();
                    break;

                    case "Add New Product" : addProduct();
                    break;

                }//end of switch
                   
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

function forSale(){
    connection.query('Select * FROM Products', function(err,res){
        if (err)throw err;
        console.log("=========================Items FOR SALE=========================")
        res.forEach(function(item){
            console.log("ID#= "+item.ItemID+" "+" Product= "+item.ProductName+" "+"  Department= "+item.DepartmentName+" "+"  Price= "+item.Price+" "+"  Inventory= "+item.StockQuantity+"\n")
      
        })
        // console.log(res)
        console.log("======================END of FOR SALE Items====================\n")
        begin();
    });
    
}

function lowInventory(){
    connection.query('SELECT StockQuantity, ProductName FROM Products', function (err, res){
        if(err)throw err;
        console.log("=========================LOW INVENTORY Items=========================\n")
        res.forEach(function(item){
            var itemStock = parseInt(item.StockQuantity)
                if(itemStock <= 5){
                    console.log('Item= '+item.ProductName+', Stock Quantity= '+itemStock+'\n')
                }
        })
        console.log("=====================END LOW INVENTORY Items =========================\n")
        begin();
    })
}

function addInventory(){
    // console.log('this is the addInventory function');
    connection.query('SELECT ProductName FROM Products', function (err, res){
    if (err) throw err;
    inquirer.prompt([{

                type : 'list',
                name : 'product',
                choices : function (value){
                        var choicesArr = [];
                            for(var i = 0; i<res.length;i++){
                                choicesArr.push(res[i].ProductName);
                                }//end of loop
                                // console.log(choicesArr);
                                return choicesArr;
                        },//end of choice function  
                message : "What PRODUCT would you like to add Inventory to?" 
            },
            {
                type : 'input',
                name : 'amount',
                message : 'How many items would you add to add to the inventory'
                            }]).then(function(answer){
                                var productChoice = answer.product;
                                var productNumber = answer.amount;
                               
                                var query = 'UPDATE Products SET StockQuantity = StockQuantity +'+ productNumber+' WHERE ?'
                                connection.query(query,{ProductName : productChoice}, function(err,res){
                                    if (err) throw err;
                                    console.log('PRODUCT '+productChoice+' inventory has been updated, the new total is below.')
                                        var query2 = 'SELECT ProductName, StockQuantity FROM products WHERE ?'
                                        connection.query(query2,{ProductName : productChoice}, function (err,res){
                                            if (err) throw err;
                                            console.log(res[0].ProductName+" NEW INVENTORY AMOUNT = "+res[0].StockQuantity);
                                            begin();
                                        })//select query end
                                        
                                });//connection update end 
                            })
                
            })//end of query
    // connection.end();
}

function addProduct(){
    // console.log('this is the addProduct function');
    inquirer.prompt([{
                
                type : 'input',
                name : 'department',
                message : "What DEPARTMENT would you like to ADD Inventory?" 
            },
            {

                type : 'input',
                name : 'product',
                message : "What PRODUCT would you like to ADD to the Inventory?" 
            },
            {
                type : 'input',
                name : 'amount',
                message : 'How many of these items would you add to ADD to the Inventory?'
            },
            {
                type : 'input',
                name : 'cost',
                message : 'How much will each of these items cost?'
            
                            }]).then(function(answer){
                                connection.query('INSERT INTO Products (ProductName, DepartmentName, Price, StockQuantity) VALUES ("'+answer.product+'", "'+answer.department+'", '+answer.cost+', '+answer.amount+')'), function (err,res){
                                            if (err) throw err;
                                            
                                            
                                };//end of connection
                                forSale ();
                            });//end of promise

}//end of addProduct function

