/*
* created by Darshil Saraiya
* */

var home = angular.module('home', []);

home.controller('home', function ($scope, $http, $window) {
    console.log("in home");

    $http({
        method: 'POST',
        url: '/getData'
    }).success(function(result){
        if(result.statusCode == 200) {

            console.log("result:");
            if(result.role == "Finance"){
                $scope.role = "Finance";
                $scope.roleFinance = true;
                $scope.drafts = true;
                console.log(JSON.stringify(result, 0, null));
                $scope.financeDrafts = result.data.drafts;
                $scope.financeBills = result.data.bills;
            } else if(result.role == "CustomerSuccess") {
                $scope.role = 'CustomerSuccess';
                $scope.roleCustomerSuccessSales = true;
                $scope.customerSuccessSalesData = result.data;
                $scope.headerData = 'Bills - Customer Success';
                $scope.descriptionData = 'Draft Bills to be approved by Customer Success';
            } else if(result.role == "Sales"){
                $scope.role = 'Sales';
                $scope.roleCustomerSuccessSales = true;
                $scope.customerSuccessSalesData = result.data;
                $scope.headerData = 'Bills - Sales';
                $scope.descriptionData = 'Bills to be approved by Sales';
            } else {
                $scope.error = true;
            }

            if(result.errorMessage != null && result.errorMessage != undefined)
                $scope.errorMessage = result.errorMessage;

            if(result.errorMessageBills != null && result.errorMessageBills!= undefined)
                $scope.errorMessageBills = result.errorMessageBills;
            console.log(JSON.stringify(result, 0, null));
            console.log("role: " + $scope.role);
        } else {
            console.log("StatusCode: " + result.statusCode);
            //$scope.error = true;
            $scope.errorMessage = result.errorMessage;
        }
    }, function(err){
        console.log("Error!!");
        console.log(err);
    });

    $scope.toggleNavBar = function(value) {
      if(value == 0) {
          $scope.drafts = true;
          $scope.bills = false;
      } else {
          $scope.bills = true;
          $scope.drafts = false;
      }
    };

    $scope.approveFinance = function(
        index,
        usageId,
        customerID,
        month,
        year,
        overageUnits,
        overageUnitCost,
        overageAmount){
        console.log("in approveFinance");

        $http({
            method: 'POST',
            url: '/approveBillFinance',
            params: {
                usageId: usageId,
                customerID: customerID,
                month: month,
                year: year,
                overageUnits: overageUnits,
                overageUnitCost: overageUnitCost,
                overageAmount: overageAmount
            }
        }).success(function(result){
            $scope.errorMessage = result.errorMessage;
            if(result.statusCode == 200) {
                $scope.errorMessage = result.errorMessage;
                console.log("index is: " + index);
                var temp = $scope.financeDrafts;
                console.log("before:");
                console.log(JSON.stringify(temp, 0, null));
                temp.splice(index, 1);
                console.log("after:");
                console.log(JSON.stringify(temp, 0, null));
                if(temp.length < 1)
                    $scope.errorMessage = "No DRAFTs to show for Finance!";
            } else {
                console.log("StatusCode: " + result.statusCode);
                //$scope.error = true;
                $scope.errorMessage = result.errorMessage;
            }
        }).error(function(error){
            console.log("Error!!");
            console.log(JSON.stringify(error));
        });
    };

    $scope.approve_reject = function(index, billId, status, role){
        console.log("in approve_reject");
        console.log("Status: " + status);
        console.log("BillId: " + billId);
        $http({
            method: 'POST',
            url: '/approveRejectBill',
            params: {
                billId: billId,
                status: status + '_' + role.toUpperCase()
            }
        }).success(function(result){
            $scope.errorMessage = result.errorMessage;
            if(result.statusCode == 200) {
                $scope.errorMessage = result.errorMessage;
                console.log("index is: " + index);
                var temp = $scope.customerSuccessSalesData;
                console.log("before:");
                console.log(JSON.stringify(temp, 0, null));
                temp.splice(index, 1);
                console.log("after:");
                console.log(JSON.stringify(temp, 0, null));
                $scope.customerSuccessSalesData = temp;

                if(temp.length < 1)
                    $scope.errorMessage = "No Bills to show!";
            } else {
                console.log("StatusCode: " + result.statusCode);
                //$scope.error = true;
                $scope.errorMessage = result.errorMessage;
            }
        }).error(function(error){
            console.log("Error!!");
            console.log(JSON.stringify(error));
        });
    };

    $scope.billSend = function(index, billId, status){
        console.log("in approve_reject");
        console.log("Status: " + status);
        console.log("BillId: " + billId);
        $http({
            method: 'POST',
            url: '/billSend',
            params: {
                billId: billId,
                status: status
            }
        }).success(function(result) {
            $scope.errorMessageBills = result.errorMessage;
            if (result.statusCode == 200) {
                $scope.errorMessageBills = result.errorMessage;
                console.log("index is: " + index);
                var temp = $scope.financeBills;
                console.log("before:");
                console.log(JSON.stringify(temp, 0, null));
                temp.splice(index, 1);
                console.log("after:");
                console.log(JSON.stringify(temp, 0, null));
                $scope.financeBills = temp;

                if (temp.length < 1)
                    $scope.errorMessageBills = "No Bills to show!";
            } else if(result.statusCode == 403){
                $scope.errorMessageBills = result.errorMessage;
                console.log("index is: " + index);
                var temp = $scope.financeBills;
                console.log("before:");
                console.log(JSON.stringify(temp, 0, null));
                temp.splice(index, 1);
                console.log("after:");
                console.log(JSON.stringify(temp, 0, null));
                $scope.financeBills = temp;
            } else {
                console.log("StatusCode: " + result.statusCode);
                //$scope.error = true;
                $scope.errorMessageBills = result.errorMessage;
            }
        }).error(function(error){
            console.log("Error!!");
            console.log(JSON.stringify(error));
        });
    };

    $scope.logout = function(){
        console.log("in Logout");

        $http({
            method: 'POST',
            url: '/logout'
        }).success(function(result){
            if(result.statusCode == 200)
                $window.location.href = '/login';
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