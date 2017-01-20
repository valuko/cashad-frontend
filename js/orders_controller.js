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
    $scope.show_alert = false;
    $scope.alert_type = "";
    $scope.alert_msg = "";
    $scope.editOrder = {};
    $scope.orders = {};

    $scope.users = UsersService.query();
    $scope.products = ProductsService.query();
    //$scope.orders = OrdersService.query({expand: 'user,product'});

    $scope.PopMsg = function (msg, msgtype) {

        if (msgtype == "success") {
            $scope.alert_type = "alert-success";
        } else {
            $scope.alert_type = "alert-danger";
        }
        $scope.alert_msg = msg;
        $scope.show_alert = true;
        setTimeout(function () {
            $scope.show_alert = false;
        }, 3000);
    };

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
            $scope.PopMsg("New order successfully created", 'success');
            $scope.updateData();

            $scope.hideNew();
        }, function (errData) {
            console.log("Error response",errData);
            $scope.PopMsg("New order could not be created", 'error');
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
            $scope.PopMsg("Order successfully updated", 'success');

            $scope.hideEdit();
        }, function (errData) {
            console.log("Update error response", errData);
            $scope.PopMsg("Order could not be updated", 'error');
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
                $scope.PopMsg("Order successfully deleted", 'success');
                $scope.updateData();
            }, function (errData) {
                console.log("Error Removing", order, errData);
                $scope.PopMsg("Order could not be removed", 'error');
            })
        }
    };

    $scope.hideEdit = function () {
        $scope.show_edit = false;
        $scope.editOrder = {};
    };
    $scope.hideNew = function () {
        $scope.show_new = false;
        $scope.newOrder = {};
    };

    $scope.updateData();
});