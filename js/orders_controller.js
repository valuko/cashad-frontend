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
        period: null, name: null,
        expand: 'user,product'
    };
    $scope.show_edit = false;
    $scope.show_new = false;
    $scope.show_alert = false;
    $scope.alert_type = "";
    $scope.alert_msg = "";
    $scope.editOrder = {};
    $scope.orders = {};
    $scope.pagination = {
        page_count: 1,
        current_page: 1,
        total_count: 0,
        per_page: 5
    };

    $scope.users = UsersService.query();
    $scope.products = ProductsService.query();

    $scope.PopMsg = function (msg, msgtype) {

        $scope.alert_type = "alert-"+msgtype;
        $scope.alert_msg = msg;
        $scope.show_alert = true;
        setTimeout(function () {
            $scope.show_alert = false;
        }, 3000);
    };

    $scope.updateFilters = function () {
        console.log("Filters updated to ",$scope.filters);
        $scope.updateData();
    };

    $scope.startNew = function () {
        $scope.show_new = true;
    };

    $scope.updateData = function () {
        $scope.orders = OrdersService.query($scope.filters, function (resp, headers) {
            $scope.pagination.current_page = headers('x-pagination-current-page');
            $scope.pagination.page_count = headers('x-pagination-page-count');
            $scope.pagination.per_page = headers('x-pagination-per-page');
            $scope.pagination.total_count = headers('x-pagination-total-count');

            if (typeof resp[0] == "undefined") {
                $scope.PopMsg("No record matches your search criteria", "warning");
            } else {
                $scope.show_alert = false;
            }
        }, function (errData, status, headers, config) {

        });
    };

    $scope.doNew = function () {
        OrdersService.save($scope.newOrder, function (resp) {
            console.log("Api response",resp);
            $scope.PopMsg("New order successfully created", 'success');
            $scope.updateData();

            $scope.hideNew();
        }, function (errData) {
            console.log("Error response",errData);
            $scope.PopMsg("New order could not be created", 'danger');
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
            $scope.PopMsg("Order could not be updated", 'danger');
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
                $scope.PopMsg("Order could not be removed", 'danger');
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