app.directive("serverCheck", ["proxy", "timer", "$timeout", function (proxy, timer, $timeout) {
    return {
        priority:0,
        templateUrl:'/resource/html?path=plugins/serverCheck/serverCheck.html',
        replace:true,
        transclude:false,
        restrict:'EA',
        scope:true,
        controller:function ($scope) {
            $scope.check = $scope.dashboardConfig.check || [];

            var checker = function () {
                angular.forEach($scope.check, function (c) {
                    proxy.get(c.url, function (html) {
                        $timeout(function () {
                            console.log(html.match(c.match))
                            c.result = html.match(c.match).length > 0;
                        });
                    });
                });
            };
            timer.start(checker);
        }
    };
}]);
