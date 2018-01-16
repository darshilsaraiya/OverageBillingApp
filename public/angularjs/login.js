/*
* created by Darshil Saraiya
* */

var login = angular.module('login', []);

login.controller('login', function ($scope, $http, $window){

    $scope.login = function(){
       console.log("username: "+ $scope.username);
       console.log("password: " + $scope.password);
        $http({
           method: 'POST',
           url: '/checkLogin',
           params: {
               username: $scope.username,
               password: $scope.password
           }
       }).success(function(result){
          if(result.statusCode == 200)
            $window.location.href = '/';
          else {
              console.log("StatusCode: " + result.statusCode);
              //$scope.error = true;
              $scope.errorMessage = result.errorMessage;
          }
       }).error(function(error){
            console.log("Error!!");
            console.log(JSON.stringify(error));
       });
   }
});