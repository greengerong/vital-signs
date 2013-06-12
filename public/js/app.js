var manageApp = angular.module("manageApp", ["ui.bootstrap"]);
manageApp.
    config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/plugins', {templateUrl:'/templates/plugins.html', controller:"pluginsCtr"}).
        otherwise({redirectTo:'/plugins'});
}]).factory("underscore", ["$window", function ($window) {
    return $window._;
}]);

var pluginsCtr = function ($scope, $http, $timeout) {

    $http.get("/plugins/allPlugins").success(function (data) {
        $timeout(function () {
            data=["c","c","b","c"]
            $scope.plugins = data.map(function (item) {
                return {key:item};
            });
        });
    });
};
manageApp.controller("pluginsCtr", ["$scope", "$http", "$timeout", pluginsCtr]);

