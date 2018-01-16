/*
* Created by Darshil Saraiya
* */

var mysql = require('./mysql');

exports.loginpage = function(req, res){
    if(req.session != null && req.session.username != null && req.session.role != null){
      console.log("Already Logged In!!");
      res.redirect('/');
    } else {
      res.render('login');
    }
};

exports.logout = function(req, res){
    if(req.session != null && req.session.username != null && req.session.role != null){
        console.log("Logged In!!");
        req.session.reset();
        console.log("Logged Out!");
        var json_response = {
            "statusCode": 200
        };
        res.send(json_response);
    } else {
        res.console.log("Login before Logging out!");
        res.redirect('/login');
    }
};

exports.checkLogin = function(req, res){
  console.log("in checkLogin");
  if(req.session != null && req.session.username != null && req.session.role != null) {
      console.log("Already Logged In!!");
      res.redirect("/");
  } else {
      var username = req.param("username");//req.body.username;
      var password = req.param("password");//req.body.password;
      console.log("username: " + username);
      console.log("password: " + password);


      var query = "select username, role from stakeholders where username = '" + username + "' and password = '" + password + "'";
      mysql.fetchData(function (err, result) {
          if (err) {
              console.log("Invalid Login!");
              json_response = {
                  "statusCode": 400,
                  "errorMessage": "Invalid Login Credentials!"
              }
          } else {

              if (result.length > 0) {
                  req.session.username = username;
                  req.session.role = result[0].role;
                  json_response = {
                      "statusCode": 200
                  }
              }
          }

          console.log(JSON.stringify(json_response, 0, null));

          res.send(json_response);
      }, query);
  }
};