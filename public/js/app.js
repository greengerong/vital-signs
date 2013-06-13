var manageApp = angular.module("manageApp", ["ui.bootstrap"]);
manageApp.
    config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/plugins', {templateUrl:'/templates/plugins.html', controller:"pluginsCtr"}).
        when('/npm', {templateUrl:'/templates/npm.html', controller:"npmCtr"}).
        otherwise({redirectTo:'/plugins'});
}]).factory("underscore", ["$window", function ($window) {
    return $window._;
}]);

var pluginsCtr = function ($scope, $http, $timeout) {

    var getDescription = function (plugins) {
        angular.forEach(plugins, function (item) {
            $http.get("/plugins/about?name=" + item.key).success(
                function (item) {
                    return function (data) {
                        $timeout(function () {
                            item.desc = data;
                        });
                    };
                }(item));
        });
    };

    $http.get("/plugins/allPlugins").success(function (data) {
        $timeout(function () {
            $scope.plugins = data.map(function (item) {
                return {key:item};
            });
            getDescription($scope.plugins);
        });
    });
};

var npmCtr = function ($scope, $http, $timeout) {

};

var navCtr = function ($scope, $location) {
    $scope.active = $location.$$path;
};

manageApp.controller("pluginsCtr", ["$scope", "$http", "$timeout", pluginsCtr]);
manageApp.controller("npmCtr", ["$scope", "$http", "$timeout", npmCtr]);
manageApp.controller("navCtr", ["$scope", "$location", navCtr]);

