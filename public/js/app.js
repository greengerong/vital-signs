var manageApp = angular.module("manageApp", ["ui.bootstrap", "ui.validate","ui.codemirror"]);
manageApp.
    config(['$routeProvider', function ($routeProvider) {
    $routeProvider.
        when('/plugins', {templateUrl:'/templates/plugins.html', controller:"pluginsCtr"}).
        when('/npm', {templateUrl:'/templates/npm.html', controller:"npmCtr"}).
        when('/project', {templateUrl:'/templates/project.html', controller:"projectCtr"}).
        when('/project/:project', {templateUrl:'/templates/project-detail.html', controller:"projectDetailCtr"}).
        when('/home', {templateUrl:'/templates/home.html'}).
        otherwise({redirectTo:'/home'});
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

var npmCtr = function ($scope, $http, $timeout, underscore) {

    $http.get("/plugins/allNpmPlugins").success(function (data) {
        $timeout(function () {
            $scope.npmPlugins = data;
        });
    });

    $scope.notUnique = function (npmPluginName) {
        if (npmPluginName) {
            var result = underscore.filter($scope.npmPlugins, function (item) {
                return item.toLowerCase() === npmPluginName.toLowerCase();
            });
            return result.length == 0;
        }
        return true;
    };

    $scope.addNpm = function () {
        if ($scope.npmPluginName) {
            $http.get("/plugins/addNpmPlugin?name=" + $scope.npmPluginName).success(function (data) {
                $timeout(function () {
                    $scope.npmPlugins.push($scope.npmPluginName);
                    $scope.npmPluginName = "";
                    $scope.result = data;
                });
            }).error(function (error) {
                    $scope.result = "error:" + error;
                });
        }
    };
};

var navCtr = function ($scope, $location) {
    $scope.active = $location.$$path;
};
var projectCtr = function ($scope, $http, $timeout, underscore) {
    $http.get("/project/all").success(function (data) {
        $timeout(function () {
            $scope.projects = data;
        });
    });

    $scope.notUnique = function (projectName) {
        if (projectName) {
            var result = underscore.filter($scope.projects, function (item) {
                return item.toLowerCase() === projectName.toLowerCase();
            });
            return result.length == 0;
        }
        return true;
    };
    $scope.addProject = function () {
        if ($scope.projectName) {
            $http.get("/project/new?name=" + $scope.projectName).success(function () {
                $timeout(function () {
                    $scope.projects.push($scope.projectName);
                    $scope.projectName = "";
                    $scope.result = "success";
                });
            }).error(function (error) {
                    $scope.result = "error:" + error;
                });
        }
    };
};

var projectDetailCtr = function ($scope, $http, $timeout, $routeParams, $window) {
    $scope.project = $routeParams.project;

    $scope.htmlOptions = $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'html'
    };
    $scope.jsOptions = $scope.editorOptions = {
        lineWrapping : true,
        lineNumbers: true,
        mode: 'javascript'
    };

    $scope.remove = function () {
        var confirm = $window.confirm("Do you make sure to remove this project?");
        if (confirm) {
            console.log("remove");
        }
    };
};

manageApp.controller("pluginsCtr", ["$scope", "$http", "$timeout", pluginsCtr]);
manageApp.controller("npmCtr", ["$scope", "$http", "$timeout", "underscore", npmCtr]);
manageApp.controller("projectCtr", ["$scope", "$http", "$timeout", "underscore", projectCtr]);
manageApp.controller("navCtr", ["$scope", "$location", navCtr]);
manageApp.controller("projectDetailCtr", ["$scope", "$http", "$timeout", "$routeParams", "$window", projectDetailCtr]);

