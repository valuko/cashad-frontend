/**
 * Created by Victor on 20/01/2017.
 */

var apiURL = "http://localhost:8080/"; //TODO: resolve and fix correctly

var cashadApp = angular.module('cashad', ['ngResource']);

cashadApp.service('UsersService', function ($resource) {
    return $resource(apiURL+'users');
})

.service('ProductsService', function ($resource) {
    return $resource(apiURL+'products');
})

.service('OrdersService', function ($resource) {
    return $resource(apiURL+'orders');
})

.controller('OrdersCtrl', function ($scope, UsersService, ProductsService, OrdersService) {
    $scope.newOrder = {
        user_id: null,
        product_id: null,
        qty: null
    };
    $scope.filters = {
        period: null, search: null
    };

    $scope.users = UsersService.query();
    $scope.products = ProductsService.query();
    $scope.orders = OrdersService.query({expand: 'user,product'});

    $scope.updateFilters = function () {
        console.log("Filters updated to ",$scope.filters);
    };

    $scope.startUpdate = function (order) {
        console.log("I will update order", order);
    };

    $scope.startDelete = function (order) {
        console.log("I will delete order", order);
    }
});