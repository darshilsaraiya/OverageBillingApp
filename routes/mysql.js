/*
* Created by Darshil Saraiya
* */

var mysql = require('mysql');

//connection pooling
function getConnection(){
    var connection = mysql.createPool({
        connecitonLimit : 10,
        host     : 'localhost',
        user     : 'root',
        password : 'root',
        database : 'segment',
        port	 : 3306
    });
    return connection;
}

function fetchData(callback,sqlQuery){

    console.log("\nSQL Query::"+sqlQuery);

    var connection=getConnection();
    connection.getConnection(function(err, connection){
        connection.query(sqlQuery, function(err, rows, fields) {
            if(err){
                console.log("ERROR: " + err.message);
            }
            else
            {	// return err or result
                //console.log("DB Results:");
                //console.log(rows);
                callback(err, rows);
            }
            connection.release();
            console.log("\nConnection closed..");
        });
    });
}

function storeData(sqlQuery, callback){
    console.log('---SQL Query ::' + sqlQuery + '---');
    var connection = getConnection();
    connection.getConnection(function(err, connection){
        connection.query(sqlQuery, function(err, results){
            //render on success
            if(!err){
                console.log('Database Results :: ' + results);
                callback(err, results);
            }
            //render or error
            else{
                console.log('Error in getting results');
                callback(err, results);
            }
            connection.release();
            console.log('Store Connection Closed');

        });
    });
}

function deleteData(sqlQuery, callback){
    console.log('---SQL Query ::' + sqlQuery + '---');
    var connection = getConnection();
    connection.getConnection(function(err, connection){
        connection.query(sqlQuery, function(err, results){
            //render on success
            if(!err){
                console.log('Database Results :: ');
                console.log(results);
                callback(err, results);
            }
            //render or error
            else{
                console.log('Error in getting results');
                callback(err, results);
            }
            connection.release();
            console.log('Store Connection Closed');
        });
    });
}

exports.fetchData=fetchData;
exports.storeData=storeData;
exports.deleteData=deleteData;