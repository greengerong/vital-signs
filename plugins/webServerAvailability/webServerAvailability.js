app.directive("webServerAvailability", ["proxy", "timer", "$timeout", function (proxy, timer, $timeout) {
    return {
        priority:0,
        templateUrl:'/resource/html?path=plugins/webServerAvailability/webServerAvailability.html',
        replace:true,
        transclude:false,
        restrict:'EA',
        scope:true,
        controller:function ($scope) {
            $scope.check = $scope.dashboardConfig.webServerAvailability || [];

            var checker = function () {
                angular.forEach($scope.check, function (c) {
                    proxy.get(c.url, function (html) {
                        $timeout(function () {
                            c.result = html.match(c.match).length > 0;
                        });
                    });
                });
            };
            timer.start(checker);
        }
    };
}]);
