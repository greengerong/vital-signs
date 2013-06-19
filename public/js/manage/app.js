var manageApp = angular.module("manageApp", ["ui.bootstrap", "ui.validate", "ui.codemirror"]);
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

var pluginsCtr = function ($scope, $http, $timeout, $dialog) {

    var getDescription = function (plugins, $dialog) {
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

        $scope.cleanRequireCache = function () {
            $http.post("/proxy/removeCache", {plugin:this.cleanJob.pluginName, job:this.cleanJob.jobName}).success(function () {
                $dialog.messageBox('clean cache success:', 'clean cache success.',
                    [
                        {result:'ok', label:'OK', cssClass:'btn-info'}
                    ])
                    .open();
            });
        };
    });
};

var npmCtr = function ($scope, $http, $timeout, underscore, $dialog) {

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

            return result.length === 0;
        }
        return true;
    };

    $scope.addNpm = function () {
        if ($scope.npmPluginName) {
            $http.post("/plugins/addNpmPlugin", {name:$scope.npmPluginName}).success(function (data) {
                $timeout(function () {
                    $scope.npmPlugins.push($scope.npmPluginName);
                    $scope.npmPluginName = "";
                    $dialog.messageBox('add npm plugin success:', 'add npm plugin success.',
                        [
                            {result:'ok', label:'OK', cssClass:'btn-info'}
                        ])
                        .open();
                });
            }).error(function (error) {
                    $dialog.messageBox('add npm plugin failed:', "error:" + error,
                        [
                            {result:'ok', label:'OK', cssClass:'btn-info'}
                        ])
                        .open();
                });
        }
    };
};

var navCtr = function ($scope, $location) {
    $scope.active = $location.$$path || "/home";
};
var projectCtr = function ($scope, $http, $timeout, underscore, $dialog) {
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
            return result.length === 0;
        }
        return true;
    };
    $scope.addProject = function () {
        if ($scope.projectName) {
            $http.post("/project/new", {name:$scope.projectName}).success(function () {
                $timeout(function () {
                    $scope.projects.push($scope.projectName);
                    $scope.projectName = "";
                    $dialog.messageBox('new project :', 'new project success.',
                        [
                            {result:'ok', label:'OK', cssClass:'btn-info'}
                        ])
                        .open();
                });
            }).error(function (error) {
                    $dialog.messageBox('new project failed:', "error:" + error,
                        [
                            {result:'ok', label:'OK', cssClass:'btn-info'}
                        ])
                        .open();
                });
        }
    };
};

var projectDetailCtr = function ($scope, $http, $timeout, $routeParams, $window, $location, $filter, $dialog) {
    $scope.project = $routeParams.project;

    $scope.htmlOptions = $scope.editorOptions = {
        lineWrapping:true,
        lineNumbers:true,
        mode:'htmlmixed'
    };
    $scope.jsOptions = $scope.editorOptions = {
        lineWrapping:true,
        lineNumbers:true,
        mode:'javascript'
    };

    $http.get("/project/config?name=" + $scope.project).success(function (data) {
        $timeout(function () {
            data.setting = $filter("json")(data.setting);
            $scope.config = data;
        });
    });

    $scope.remove = function () {
        $dialog.messageBox('Are you sure?', 'Are you sure to remove this project?',
            [
                {result:'no', label:'Cancel', cssClass:'btn-info'},
                {result:'ok', label:'OK', cssClass:'btn-info'}
            ])
            .open().then(function (result) {
                if (result === "ok") {
                    $http.post("/project/remove", {name:$scope.project}).success(function () {
                        $location.path("/project");
                    });
                }
            });
    };

    $scope.isJson = function (json) {
        try {
            $.parseJSON(json);
            return true;
        } catch (e) {
            return false;
        }
    };

    $scope.saveConfig = function () {
        $http.post("/project/saveConfig", {name:$scope.project, config:$scope.config})
            .success(function () {
                $dialog.messageBox('project config saved:', 'project config save success.',
                    [
                        {result:'ok', label:'OK', cssClass:'btn-info'}
                    ])
                    .open();
            });
    };
};

manageApp.controller("pluginsCtr", ["$scope", "$http", "$timeout", "$dialog", pluginsCtr]);
manageApp.controller("npmCtr", ["$scope", "$http", "$timeout", "underscore", "$dialog", npmCtr]);
manageApp.controller("projectCtr", ["$scope", "$http", "$timeout", "underscore", "$dialog", projectCtr]);
manageApp.controller("navCtr", ["$scope", "$location", navCtr]);
manageApp.controller("projectDetailCtr", ["$scope", "$http", "$timeout", "$routeParams", "$window",
    "$location", "$filter", "$dialog", projectDetailCtr]);

