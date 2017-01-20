/**
 * Created by Victor on 20/01/2017.
 */

var cashadApp = angular.module('cashad', ['ngResource']);

cashadApp.service('UserService', function () {

})

.service('ProductService', function () {

})

.service('OrderService', function () {

})

.controller('OrdersCtrl', function ($scope) {
    $scope.title = "Orders Managemt";
});