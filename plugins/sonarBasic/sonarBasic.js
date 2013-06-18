app.directive("sonarBasic", ["proxy", "timer", "$timeout", "underscore", function (proxy, timer, $timeout, underscore) {
    return {
        priority: 0,
        templateUrl: '/resource/html?path=plugins/sonarBasic/sonarBasic.html',
        replace: true,
        transclude: false,
        restrict: 'EA',
        scope: true,
        controller: function ($scope) {
            $scope.sonarBasic = $scope.dashboardConfig.sonarBasic || {};
            var checker = function () {
                angular.forEach($scope.sonarBasic.group, function (g) {
                    var keySet = underscore.map(g.cols, function (c) {
                        return c.key;
                    });
                    var metrics = keySet.join(",");
                    var url = $scope.sonarBasic.url + "api/resources?resource=" + $scope.sonarBasic.resource + "&metrics=" + metrics;
                    var success = function (g) {
                        return function (data) {
                            var result = {};
                            angular.forEach(data[0].msr, function (m) {
                                result[m.key] = m.frmt_val;
                            });
                            $timeout(function () {
                                g.result = result;
                            });
                        };
                    };
                    proxy.get(url, success(g));
                });
            };
            timer.start(checker);
        }
    };
}]);
