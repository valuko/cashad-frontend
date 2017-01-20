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
    return $resource(apiURL+'orders/:id', {id: '@_id'}, {
        update: {method: 'PUT'}
    });
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
    $scope.show_edit = false;
    $scope.show_new = false;
    $scope.editOrder = {};
    $scope.orders = {};

    $scope.users = UsersService.query();
    $scope.products = ProductsService.query();
    //$scope.orders = OrdersService.query({expand: 'user,product'});

    $scope.updateFilters = function () {
        console.log("Filters updated to ",$scope.filters);
    };

    $scope.startNew = function () {
        $scope.show_new = true;
    };

    $scope.updateData = function () {
        $scope.orders = OrdersService.query({expand: 'user,product'});
    };

    $scope.doNew = function () {
        OrdersService.save($scope.newOrder, function (resp) {
            console.log("Api response",resp);
            //TODO: Process and update table list
        }, function (errData) {
            console.log("Error response",errData);
        });
    };

    $scope.doEdit = function () {
        var editData = {
            _id: $scope.editOrder.id,
            user_id: $scope.editOrder.user.id,
            product_id: $scope.editOrder.product.id,
            quantity: $scope.editOrder.quantity
        };

        OrdersService.update(editData, function (resp) {
            console.log("Update response", resp);
            //TODO: Process and show message
        });
    };

    $scope.startUpdate = function (order) {
        console.log("I will update order", order);
        $scope.show_edit = true;
        $scope.editOrder = order;
        $scope.show_new = false;
    };

    $scope.startDelete = function (order) {
        if (confirm("Are you sure you want to delete?")) {
            OrdersService.delete({id: order.id}, function (resp) {
                console.log("Successfully removed", resp, order);
                $scope.updateData();
            }, function (errData) {
                console.log("Error Removing", order, errData);
            })
        }
    };

    $scope.hideEdit = function () {
        $scope.show_edit = false;
        $scope.editOrder = {};
    };
    $scope.hideNew = function () {
        $scope.show_new = false;
    };

    $scope.updateData();
});