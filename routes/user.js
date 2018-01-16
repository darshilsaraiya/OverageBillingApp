/*
* Created by Darshil Saraiya
* */

var mysql = require('./mysql');
var request = require('request');

exports.home = function (req, res) {
    console.log("in home");
    if(req.session != null && req.session.username != null && req.session.role != null) {
        res.render('home');
    }  else {
        console.log("Not Logged In!! Please Log in!!");
        res.redirect('/login');
    }
};

exports.getData = function(req, res){
    if(req.session != null && req.session.username != null && req.session.role != null) {
        var json_response;
        if(req.session.role == "Finance"){
            getFinanceData(function(json_response){
                //console.log("json_response:");
                //console.log(JSON.stringify(json_response, 0, null));
                json_response.role = req.session.role;
                res.send(json_response);
            });
        }  else if(req.session.role == "CustomerSuccess"){
            getCustomerSuccessData(function(json_response){
                json_response.role = req.session.role;
                res.send(json_response);
            });
        } else if(req.session.role == "Sales") {
            getSalesData(function(json_response){
                json_response.role = req.session.role;
                //console.log("json_response: " + JSON.stringify(json_response, 0, null));
                res.send(json_response);
            });
        } else {
            req.session = null;
            console.log("Not Logged In Correctly!! Please Log in!!");
            res.render('login');
        }

        //res.send(json_response);
    }  else {
        console.log("Not Logged In!! Please Log in!!");
        res.render('login');
    }
};

var getFinanceData = function(callback){
    console.log("in Finance Page");
    var d = new Date();
    d.setDate(d.getDate() - 90);

    console.log("currentDate: " + d);
    var query =
        "select " +
            "u.usageID, c.customerID, u.month, u.year, u.apiUsage, c.monthlyapiLimit, c.overageUnitCost " +
        "from " +
            "usages as u " +
                "join " +
            "customers as c " +
                "on u.customerID = c.customerID " +
        "where " +
            "c.startdate < DATE('" + exports.getFormattedDate() + "') and " +
            "c.requireCSMapproval = 1 and " +
            "u.apiUsage > c.monthlyapiLimit and " +
            "u.billGenerated = 0";

    mysql.fetchData(function(err, result) {
        if(err) {
            console.log("No new records found!");
            var json_response = {
                "statusCode": 400,
                "errorMessage": "No records to show for billing!"
            };

            getFinanceBills(json_response, function(result_bills) {
                console.log(JSON.stringify(json_response, 0, null));
                callback(result_bills);
            });
        } else {
            if(result.length > 0) {
                console.log("result of bills: ");
                //console.log(JSON.stringify(result, 0, null));
                var json_response = {
                    "statusCode": 200,
                    //"role": "Finance",
                    "data": {
                        "drafts": result
                    }
                };

                getFinanceBills(json_response, function(result_bills) {
                    console.log(JSON.stringify(json_response, 0, null));
                    callback(result_bills);
                });

            } else {
                var json_response = {
                    "statusCode": 200,
                    "errorMessage": "No records(Bills) to show for Finance!"
                };

                getFinanceBills(json_response, function(result_bills) {
                    console.log(JSON.stringify(json_response, 0, null));
                    callback(result_bills);
                });
            }
        }

        //console.log(JSON.stringify(json_response, 0, null));
        //callback(json_response);
    }, query);
};

var getFinanceBills = function(json_response, callback){
    console.log("getting Finance Bills");
    var query_bills =
        "select " +
            "billID, usageID, customerID, month, year, overageUnits, overageUnitPrice, overageAmount " +
        "from bill " +
        "where " +
            "status = 'FINAL'";

    console.log(JSON.stringify(json_response, 0, null));

    mysql.fetchData(function(err, result_finals_bills) {
        if(err) {
            console.log("No records found for finals_bills!");
            json_response.errorMessageBills = "No records to show for Finance Bills!";
        } else {
            if(result_finals_bills.length > 0) {
                console.log("result of Finance Finals Bills: ");
                //console.log(JSON.stringify(result_finals_bills, 0, null));
                json_response.data.bills = result_finals_bills;

            } else
                json_response.errorMessageBills = "No records(Bills) to show for Customer Success!";
        }

        console.log(JSON.stringify(json_response, 0, null));
        callback(json_response);
    }, query_bills);
};

var getCustomerSuccessData = function(callback){
    console.log("in Customer Success Page");

    var query =
        "select " +
            "billID, usageID, customerID, month, year, overageUnits, overageUnitPrice, overageAmount " +
        "from bill " +
        "where " +
            "status = 'DRAFT'";

    mysql.fetchData(function(err, result) {
        if(err) {
            console.log("No records found!");
            var json_response = {
                "statusCode": 400,
                "errorMessage": "No records to show for Customer Success!"
            }
        } else {
            if(result.length > 0) {
                console.log("result of Customer Success: ");
                //console.log(JSON.stringify(result, 0, null));
                var json_response = {
                    "statusCode": 200,
                    //"role": "CustomerSuccess",
                    "data": result
                }
            } else {
                var json_response = {
                    "statusCode": 200,
                    "errorMessage": "No records(Bills) to show for Customer Success!"
                }
            }
        }

        console.log(JSON.stringify(json_response, 0, null));
        callback(json_response);
    }, query);
};

var getSalesData = function(callback){
    console.log("in Sales Page");

    var query =
        "select " +
            "billID, usageID, customerID, month, year, overageUnits, overageUnitPrice, overageAmount " +
        "from bill " +
        "where " +
            "status = 'APPROVE_CUSTOMERSUCCESS'";

    mysql.fetchData(function(err, result) {
        if(err) {
            console.log("No records found!");
            var json_response = {
                "statusCode": 400,
                "errorMessage": "No records to show for Sales!"
            }
        } else {
            if(result.length > 0) {
                console.log("result of Sales: ");
                //console.log(JSON.stringify(result, 0, null));
                var json_response = {
                    "statusCode": 200,
                    //"role": "Sales",
                    "data": result
                }
            } else {
                var json_response = {
                    "statusCode": 200,
                    "errorMessage": "No records(Bills) to show for Sales!"
                }
            }
        }

        console.log(JSON.stringify(json_response, 0, null));
        callback(json_response);
    }, query);
};

exports.approveBillFinance = function (req, res) {
    console.log("in approveBillFinance");
    if(req.session != null && req.session.username != null && req.session.role != null) {
        var usageId= req.param("usageId");
        var customerID= req.param("customerID");
        var month= req.param("month");
        var year= req.param("year");
        var overageUnits= req.param("overageUnits");
        var overageUnitCost= req.param("overageUnitCost");
        var overageAmount= req.param("overageAmount");

        var query = "INSERT INTO bill " +
                "(usageID, " +
                "customerID, " +
                "month, " +
                "year, " +
                "status, " +
                "overageUnits, " +
                "overageUnitPrice, " +
                "overageAmount, " +
                "generatedTimestamp, " +
                "updatedTimestamp) " +
            "VALUES (" +
                usageId + ", " +
                customerID + ", " +
                month + ", " +
                year + ", " +
                "'DRAFT', " +
                overageUnits + ", " +
                overageUnitCost + ", " +
                overageAmount + ", " +
                "NOW(), " +
                "NOW())";

        mysql.storeData(query, function (err, result) {
            if(!err){
                console.log("Finance has approved the Bill!");

                var query_delete = "UPDATE usages " +
                    "SET billGenerated = 1 " +
                    "WHERE usageID = " + usageId;
                mysql.storeData(query_delete, function(err, result){
                    if(!err){
                        console.log("Bill has been Generated!");
                        var json_response = {
                            "statusCode": 200,
                            "errorMessage": "Bill with Usage ID " + usageId + " has been generated!"
                        };

                        res.send(json_response);
                    } else {
                        console.log("Error: " + JSON.stringify(result, 0, null));
                        var json_response = {
                            "statusCode": 400,
                            "errorMessage": "Could not generate Bill. Please try again!",
                            "error": err
                        };
                        res.send(json_response);
                    }
                });
            } else {
                console.log("Error: " + JSON.stringify(result, 0, null));
                var json_response = {
                    "statusCode": 400,
                    "errorMessage": "Could not generate Bill. Please try again!",
                    "error": err
                };
                res.send(json_response);
            }
        });

    } else {
        console.log("Not Logged In!! Please Log in!!");
        res.render('login');
    }
};

exports.approveRejectBill = function(req, res) {
  console.log("in approveRejectBill");
    if(req.session != null && req.session.username != null && req.session.role != null) {
        var role = req.session.role;
        var billId = req.param("billId");
        var status = req.param("status");

        console.log("billId: " + billId);
        console.log("status: " + status);

        if(status == "APPROVE_SALES"){
            status = "FINAL";
        }

        var query = "UPDATE bill " +
            "SET status = '" + status + "', updatedTimestamp = NOW() " +
            "WHERE billID = " + billId;
        
        mysql.storeData(query, function(err, result) {
            if(!err){
                console.log("Bill with billID: '" + billId + "' has been Updated with status: '" + status + "'!");
                var json_response = {
                    "statusCode": 200,
                    "errorMessage": "Bill with Bill ID " + billId + " has been updated by '" + role + "'!"
                };

                res.send(json_response);
            } else {
                console.log("Error: " + JSON.stringify(result, 0, null));
                var json_response = {
                    "statusCode": 400,
                    "errorMessage": "Could not Update Bill. Please try again!",
                    "error": err
                };
                res.send(json_response);
            }
        });

    } else {
        console.log("Not Logged In!! Please Log in!!");
        res.render('login');
    }
};

exports.billSend = function(req, res) {
    console.log("in billSend");
    if(req.session != null && req.session.username != null && req.session.role != null) {
        var role = req.session.role;
        var billId = req.param("billId");
        var status = req.param("status");

        console.log("billId: " + billId);
        console.log("status: " + status);

        var query = "UPDATE bill " +
            "SET status = '" + status + "', updatedTimestamp = NOW() " +
            "WHERE billID = " + billId;

        mysql.storeData(query, function(err, result) {
            if(!err){
                console.log("Bill with billID: '" + billId + "' has been Updated with status: '" + status + "'!");
                /*var json_response = {
                    "statusCode": 200,
                    "errorMessage": "Bill with Bill ID " + billId + " has been updated by '" + role + "'!"
                };*/
                console.log("Bill with Bill ID " + billId + " has been updated by '" + role + "'!");

                var query_getFinalBill =
                    "select " +
                        "b.billID, b.customerID, c.customerName, c.billingAddress, c.billingEmail, b.month, b.year, c.monthlyapiLimit, b.overageUnits, b.overageUnitPrice, b.overageAmount, c.startDate " +
                    "from " +
                        "bill as b " +
                            "join " +
                        "customers as c " +
                            "on b.customerID = c.customerID " +
                    "where " +
                        "b.billID = " + billId;

                mysql.fetchData(function (err, result_bill) {
                    if (err) {
                        console.log("Invalid!");
                        json_response = {
                            "statusCode": 400,
                            "errorMessage": "Error getting final bill! " + err
                        };

                        res.send(json_response);
                    } else {

                        if (result_bill.length > 0) {

                            var finalBillJson= {
                                "sender_email": "sdarshil22@gmail.com",
                                "bill": result_bill
                            };

                            console.log("Final Bill JSON:");
                            console.log(JSON.stringify(finalBillJson, 0, null));

                            request.post(
                                'https://e69eb0a3-7f25-4043-8ca9-82e25e77fc9e.trayapp.io',
                                finalBillJson,
                                function(error, response, body) {
                                    console.log("error: " + JSON.stringify(error, 0, null));
                                    console.log("response: " + JSON.stringify(response, 0, null));
                                    console.log("body: " + JSON.stringify(body, 0, null));
                                    if(!error && response.statusCode == 200){
                                        console.log("final json sent to tray.io!");
                                        json_response = {
                                            "statusCode": 200,
                                            "errorMessage": "final json sent to tray.io!"
                                        }
                                    } else {
                                        console.log("could send the bill to tray.io!");
                                        console.log(JSON.stringify(body, 0, null));
                                        json_response = {
                                            "statusCode": 403,
                                            "errorMessage": "Could not send final json to tray.io: " + body
                                        }
                                    }
                                    console.log(JSON.stringify(json_response));
                                    res.send(json_response);
                                }
                            );
                        } else {
                            var json_response = {
                                "statusCode": 200,
                                "errorMessage": "No records(Bills) to show for Finance Bill(billID = '" + billId + "'!"
                            };

                            res.send(json_response);
                        }
                    }

                    //console.log(JSON.stringify(json_response, 0, null));

                    //res.send(json_response);
                }, query_getFinalBill);

            } else {
                console.log("Error: " + JSON.stringify(result, 0, null));
                var json_response = {
                    "statusCode": 400,
                    "errorMessage": "Could not Update Bill. Please try again!",
                    "error": err
                };
                res.send(json_response);
            }
        });

    } else {
        console.log("Not Logged In!! Please Log in!!");
        res.render('login');
    }
};


exports.getFormattedDate = function() {
    var d = new Date();
    if(d.getMonth() < 3)
        return (d.getFullYear()-1) + "-" + (d.getMonth()+10) + "-" + d.getDate();

    return d.getFullYear() + "-" + (d.getMonth()-2) + "-" + d.getDate();
};